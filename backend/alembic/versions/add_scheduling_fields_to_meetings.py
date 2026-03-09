"""Add scheduling fields to meetings table

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-03-09 15:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, Sequence[str], None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


SCHEDULING_COLUMNS = [
    ('reminder_10m', sa.Boolean(), {'nullable': True, 'server_default': 'false'}),
    ('reminder_at_time', sa.Boolean(), {'nullable': True, 'server_default': 'false'}),
    ('calendar_event_id', sa.String(), {'nullable': True}),
    ('schedule_status', sa.String(), {'nullable': True}),
]


def upgrade() -> None:
    """Add scheduling columns to meetings table if they don't exist."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing = {col['name'] for col in inspector.get_columns('meetings')}

    for name, col_type, kwargs in SCHEDULING_COLUMNS:
        if name not in existing:
            op.add_column('meetings', sa.Column(name, col_type, **kwargs))


def downgrade() -> None:
    """Remove scheduling columns from meetings table."""
    for name, _, _ in reversed(SCHEDULING_COLUMNS):
        try:
            op.drop_column('meetings', name)
        except Exception:
            pass
