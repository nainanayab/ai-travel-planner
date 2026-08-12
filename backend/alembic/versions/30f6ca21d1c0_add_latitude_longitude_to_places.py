"""add latitude longitude to places

Revision ID: 30f6ca21d1c0
Revises: 
Create Date: 2026-08-01 22:08:31.724669

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '30f6ca21d1c0'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'places',
        sa.Column('latitude', sa.Float(), nullable=True)
    )

    op.add_column(
        'places',
        sa.Column('longitude', sa.Float(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    op.drop_column('places', 'longitude')
    op.drop_column('places', 'latitude')
    # ### end Alembic commands ###
