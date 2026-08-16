"""add budget cities

Revision ID: 1c6ff2640ecf
Revises: b1deb6e1939f
Create Date: 2026-08-14 20:42:37.761915

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1c6ff2640ecf'
down_revision: Union[str, Sequence[str], None] = 'b1deb6e1939f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        'budget_cities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('budget_trip_id', sa.Integer(), nullable=False),
        sa.Column('city_name', sa.String(), nullable=False),
        sa.Column('days', sa.Integer(), nullable=False),
        sa.Column('hotel_cost', sa.Float(), nullable=True),
        sa.Column('breakfast_cost', sa.Float(), nullable=True),
        sa.Column('lunch_cost', sa.Float(), nullable=True),
        sa.Column('dinner_cost', sa.Float(), nullable=True),
        sa.Column('local_transport_cost', sa.Float(), nullable=True),
        sa.Column('activity_cost', sa.Float(), nullable=True),
        sa.Column('entry_fee', sa.Float(), nullable=True),
        sa.Column('miscellaneous_cost', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(
            ['budget_trip_id'],
            ['budget_trips.id']
        ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        op.f('ix_budget_cities_id'),
        'budget_cities',
        ['id'],
        unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f('ix_budget_cities_id'),
        table_name='budget_cities'
    )

    op.drop_table('budget_cities')