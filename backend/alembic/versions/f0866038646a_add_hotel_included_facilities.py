"""add hotel included facilities

Revision ID: f0866038646a
Revises: bc6baf33da95
Create Date: 2026-08-15 00:19:42.156728

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f0866038646a"
down_revision: Union[str, Sequence[str], None] = "bc6baf33da95"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add hotel included facilities."""

    op.add_column(
        "hotels",
        sa.Column(
            "breakfast_included",
            sa.Boolean(),
            server_default="true",
            nullable=False,
        ),
    )

    op.add_column(
        "hotels",
        sa.Column(
            "dinner_included",
            sa.Boolean(),
            server_default="true",
            nullable=False,
        ),
    )

    op.add_column(
        "hotels",
        sa.Column(
            "wifi_included",
            sa.Boolean(),
            server_default="true",
            nullable=False,
        ),
    )


def downgrade() -> None:
    """Remove hotel included facilities."""

    op.drop_column(
        "hotels",
        "wifi_included",
    )

    op.drop_column(
        "hotels",
        "dinner_included",
    )

    op.drop_column(
        "hotels",
        "breakfast_included",
    )