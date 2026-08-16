"""add budget transport

Revision ID: bc6baf33da95
Revises: 1c6ff2640ecf
Create Date: 2026-08-14 20:51:06.985796

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bc6baf33da95'
down_revision: Union[str, Sequence[str], None] = '1c6ff2640ecf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'budget_transports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('from_city', sa.String(), nullable=False),
        sa.Column('to_city', sa.String(), nullable=False),
        sa.Column('transport_type', sa.String(), nullable=False),
        sa.Column('distance_km', sa.Float(), nullable=True),
        sa.Column('travel_time_hours', sa.Float(), nullable=True),
        sa.Column('cost', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index(
        op.f('ix_budget_transports_id'),
        'budget_transports',
        ['id'],
        unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        op.f('ix_budget_transports_id'),
        table_name='budget_transports'
    )

    op.drop_table('budget_transports')