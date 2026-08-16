import os
from getpass import getpass

from dotenv import load_dotenv
from sqlalchemy import (
    create_engine,
    MetaData,
    text,
    inspect,
)
from sqlalchemy.engine import URL


# ============================================================
# CONFIG
# ============================================================

load_dotenv()

SUPABASE_DATABASE_URL = os.getenv("DATABASE_URL")

if not SUPABASE_DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL not found in .env. "
        "It should contain your Supabase database URL."
    )


LOCAL_HOST = "localhost"
LOCAL_PORT = 5432
LOCAL_DATABASE = "ai_tourism"
LOCAL_USER = "postgres"


# ============================================================
# LOCAL PASSWORD
# ============================================================

print("=" * 70)
print("LOCAL POSTGRESQL → SUPABASE DATA MIGRATION")
print("=" * 70)

print()
print("Enter your LOCAL PostgreSQL password.")
print("(This password will NOT be saved anywhere.)")
print()

local_password = getpass("Local PostgreSQL password: ")


# ============================================================
# LOCAL DATABASE URL
# ============================================================

local_url = URL.create(
    drivername="postgresql+psycopg2",
    username=LOCAL_USER,
    password=local_password,
    host=LOCAL_HOST,
    port=LOCAL_PORT,
    database=LOCAL_DATABASE,
)


# ============================================================
# ENGINES
# ============================================================

print()
print("Connecting to LOCAL PostgreSQL...")

local_engine = create_engine(
    local_url,
    pool_pre_ping=True,
)

print("Connecting to SUPABASE...")

supabase_engine = create_engine(
    SUPABASE_DATABASE_URL,
    pool_pre_ping=True,
)

# ============================================================
# CONNECTION TEST
# ============================================================

try:
    with local_engine.connect() as conn:
        conn.execute(text("SELECT 1"))

    print("✓ Local PostgreSQL connection successful.")

except Exception as exc:
    print()
    print("❌ Could not connect to local PostgreSQL.")
    print(exc)
    raise SystemExit(1)


try:
    with supabase_engine.connect() as conn:
        conn.execute(text("SELECT 1"))

    print("✓ Supabase connection successful.")

except Exception as exc:
    print()
    print("❌ Could not connect to Supabase.")
    print(exc)
    raise SystemExit(1)


# ============================================================
# REFLECT DATABASES
# ============================================================

local_metadata = MetaData()
supabase_metadata = MetaData()

local_metadata.reflect(
    bind=local_engine,
    schema="public",
)

supabase_metadata.reflect(
    bind=supabase_engine,
    schema="public",
)


# ============================================================
# TABLES
# ============================================================

SKIP_TABLES = {
    "alembic_version",
}

local_tables = {
    table.name: table
    for table in local_metadata.sorted_tables
    if table.name not in SKIP_TABLES
}

supabase_tables = {
    table.name: table
    for table in supabase_metadata.tables.values()
    if table.name not in SKIP_TABLES
}


print()
print("=" * 70)
print("DATABASE TABLES")
print("=" * 70)

print()
print("Local tables:")

for table_name in local_tables:
    print(f"  ✓ {table_name}")

print()
print("Supabase tables:")

for table_name in supabase_tables:
    print(f"  ✓ {table_name}")


# ============================================================
# CHECK MISSING TABLES
# ============================================================

missing_tables = set(local_tables) - set(supabase_tables)

if missing_tables:
    print()
    print("❌ These local tables do not exist in Supabase:")

    for table in sorted(missing_tables):
        print(f"  - {table}")

    print()
    print(
        "Stop here. Create/migrate the missing schema before "
        "copying data."
    )

    raise SystemExit(1)


# ============================================================
# CHECK SUPABASE IS EMPTY
# ============================================================

print()
print("=" * 70)
print("CHECKING SUPABASE DATA")
print("=" * 70)

existing_data = {}

with supabase_engine.connect() as conn:

    for table_name in local_tables:

        count = conn.execute(
            text(
                f'SELECT COUNT(*) FROM "public"."{table_name}"'
            )
        ).scalar_one()

        existing_data[table_name] = count

        if count > 0:
            print(
                f"⚠ {table_name}: {count} existing rows"
            )


non_empty_tables = {
    table: count
    for table, count in existing_data.items()
    if count > 0
}


if non_empty_tables:

    print()
    print("=" * 70)
    print("❌ MIGRATION STOPPED")
    print("=" * 70)

    print()
    print(
        "Supabase already contains data in one or more tables."
    )

    print(
        "This script intentionally does NOT delete existing data."
    )

    print()
    print("Existing rows:")

    for table, count in non_empty_tables.items():
        print(f"  {table}: {count}")

    print()
    print(
        "If this is your empty/new Supabase project and these "
        "rows are unexpected, stop and check before continuing."
    )

    raise SystemExit(1)


print()
print("✓ Supabase tables are empty.")
print("✓ Safe to migrate.")


# ============================================================
# BUILD FOREIGN KEY DEPENDENCY ORDER
# ============================================================

def get_dependency_order(tables):
    """
    Create a dependency-aware order based on foreign keys.

    Parent tables are inserted before child tables.
    """

    dependencies = {
        table_name: set()
        for table_name in tables
    }

    for table_name, table in tables.items():

        for fk in table.foreign_keys:

            parent_table = fk.column.table.name

            if (
                parent_table in tables
                and parent_table != table_name
            ):
                dependencies[table_name].add(
                    parent_table
                )

    ordered = []

    remaining = set(tables)

    while remaining:

        ready = sorted(
            table
            for table in remaining
            if dependencies[table].isdisjoint(
                remaining
            )
        )

        if not ready:

            print()
            print(
                "⚠ Circular foreign-key dependency detected."
            )

            print(
                "Remaining tables:",
                sorted(remaining),
            )

            raise RuntimeError(
                "Could not determine safe foreign-key order."
            )

        for table in ready:
            ordered.append(table)
            remaining.remove(table)

    return ordered


migration_order = get_dependency_order(
    local_tables
)


# ============================================================
# SHOW MIGRATION ORDER
# ============================================================

print()
print("=" * 70)
print("MIGRATION ORDER")
print("=" * 70)

for index, table_name in enumerate(
    migration_order,
    start=1,
):
    print(
        f"{index:02d}. {table_name}"
    )


# ============================================================
# CONFIRM
# ============================================================

print()
print("=" * 70)
print("READY TO MIGRATE")
print("=" * 70)

print()
print(
    "The following local data will be copied to Supabase:"
)

local_counts = {}

with local_engine.connect() as conn:

    for table_name in migration_order:

        count = conn.execute(
            text(
                f'SELECT COUNT(*) FROM "public"."{table_name}"'
            )
        ).scalar_one()

        local_counts[table_name] = count

        print(
            f"  {table_name}: {count}"
        )

print()
print(
    "IMPORTANT: Supabase is currently empty, "
    "so this migration will preserve your local data."
)

confirmation = input(
    "\nType MIGRATE to continue: "
).strip()


if confirmation != "MIGRATE":

    print()
    print("Migration cancelled.")

    raise SystemExit(0)


# ============================================================
# MIGRATION
# ============================================================

print()
print("=" * 70)
print("STARTING MIGRATION")
print("=" * 70)


migrated_counts = {}


with local_engine.connect() as local_conn:

    with supabase_engine.begin() as supabase_conn:

        for index, table_name in enumerate(
            migration_order,
            start=1,
        ):

            print()
            print(
                f"[{index}/{len(migration_order)}] "
                f"Migrating: {table_name}"
            )

            local_table = local_tables[
                table_name
            ]

            supabase_table = supabase_tables[
                table_name
            ]

            rows = local_conn.execute(
                local_table.select()
            ).mappings().all()

            if not rows:

                migrated_counts[
                    table_name
                ] = 0

                print(
                    "  ✓ No rows to migrate."
                )

                continue

            # ------------------------------------------------
            # INSERT IN BATCHES
            # ------------------------------------------------

            batch_size = 500

            total_inserted = 0

            for start in range(
                0,
                len(rows),
                batch_size,
            ):

                batch = rows[
                    start:start + batch_size
                ]

                supabase_conn.execute(
                    supabase_table.insert(),
                    [
                        dict(row)
                        for row in batch
                    ],
                )

                total_inserted += len(batch)

                print(
                    f"  Inserted "
                    f"{total_inserted}/{len(rows)}"
                )

            migrated_counts[
                table_name
            ] = total_inserted

            print(
                f"  ✓ {total_inserted} rows migrated."
            )


# ============================================================
# RESET POSTGRESQL SEQUENCES
# ============================================================

print()
print("=" * 70)
print("RESETTING ID SEQUENCES")
print("=" * 70)


with supabase_engine.begin() as conn:

    inspector = inspect(
        supabase_engine
    )

    for table_name in migration_order:

        table = supabase_tables[
            table_name
        ]

        for column in table.columns:

            if column.primary_key:

                # PostgreSQL sequence lookup
                result = conn.execute(
                    text(
                        """
                        SELECT pg_get_serial_sequence(
                            :table_name,
                            :column_name
                        )
                        """
                    ),
                    {
                        "table_name":
                            f"public.{table_name}",
                        "column_name":
                            column.name,
                    },
                ).scalar()

                if not result:
                    continue

                max_id = conn.execute(
                    text(
                        f'''
                        SELECT MAX("{column.name}")
                        FROM "public"."{table_name}"
                        '''
                    )
                ).scalar()

                if max_id is None:
                    continue

                conn.execute(
                    text(
                        "SELECT setval("
                        ":sequence_name, "
                        ":max_id, "
                        "true)"
                    ),
                    {
                        "sequence_name":
                            result,
                        "max_id":
                            max_id,
                    },
                )

                print(
                    f"  ✓ {table_name}.{column.name}"
                    f" → {max_id}"
                )


# ============================================================
# VERIFY
# ============================================================

print()
print("=" * 70)
print("VERIFYING MIGRATION")
print("=" * 70)

verification_failed = False


with supabase_engine.connect() as conn:

    for table_name in migration_order:

        local_count = local_counts[
            table_name
        ]

        supabase_count = conn.execute(
            text(
                f'''
                SELECT COUNT(*)
                FROM "public"."{table_name}"
                '''
            )
        ).scalar_one()

        status = (
            "✓"
            if local_count == supabase_count
            else "❌"
        )

        print(
            f"{status} "
            f"{table_name}: "
            f"local={local_count}, "
            f"supabase={supabase_count}"
        )

        if local_count != supabase_count:
            verification_failed = True


# ============================================================
# FINAL RESULT
# ============================================================

print()
print("=" * 70)

if verification_failed:

    print("❌ MIGRATION COMPLETED WITH VERIFICATION ERRORS")

else:

    print("🎉 MIGRATION SUCCESSFUL!")

print("=" * 70)

if not verification_failed:

    print()
    print(
        "Your local PostgreSQL data is now available "
        "in Supabase."
    )

    print()
    print("Next step:")
    print(
        "Start the backend and test the API "
        "against Supabase."
    )