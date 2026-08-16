"""add budget trips

Revision ID: b1deb6e1939f
Revises: bb760bd105d5
Create Date: 2026-08-14 20:36:09.304474

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1deb6e1939f'
down_revision: Union[str, Sequence[str], None] = 'bb760bd105d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        'budget_trips',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('trip_id', sa.Integer(), nullable=False),
        sa.Column('travelers', sa.Integer(), nullable=False),
        sa.Column('total_budget', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(
            ['trip_id'],
            ['trips.id']
        ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        op.f('ix_budget_trips_id'),
        'budget_trips',
        ['id'],
        unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f('ix_budget_trips_id'),
        table_name='budget_trips'
    )

    op.drop_table('budget_trips')
