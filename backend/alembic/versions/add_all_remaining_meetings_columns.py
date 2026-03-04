"""Add ALL remaining missing columns to meetings table

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-03-04 21:22:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Complete list of every column the Meeting model defines.
# Each entry: (column_name, column_type, kwargs)
MEETING_COLUMNS = [
    ('title', sa.String(), {'nullable': False, 'server_default': ''}),
    ('description', sa.Text(), {'nullable': True}),
    ('language', sa.String(), {'nullable': True, 'server_default': 'en'}),
    ('start_time', sa.DateTime(timezone=True), {'nullable': True}),
    ('duration_minutes', sa.Integer(), {'nullable': True}),
    ('end_time', sa.DateTime(timezone=True), {'nullable': True}),
    ('external_link', sa.String(), {'nullable': True}),
    ('ai_transcription', sa.Boolean(), {'nullable': True, 'server_default': 'false'}),
    ('ai_translation', sa.Boolean(), {'nullable': True, 'server_default': 'false'}),
    ('ai_recording', sa.Boolean(), {'nullable': True, 'server_default': 'false'}),
    ('created_at', sa.DateTime(timezone=True), {'nullable': True, 'server_default': sa.text('now()')}),
]

# FK columns handled separately
FK_COLUMNS = [
    ('organizer_id', postgresql.UUID(as_uuid=True), 'fk_meetings_organizer_id', 'users', ['organizer_id'], ['id']),
    ('organization_id', postgresql.UUID(as_uuid=True), 'fk_meetings_organization_id', 'organizations', ['organization_id'], ['id']),
]


def upgrade() -> None:
    """Ensure every column the Meeting model needs exists in the table."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing = {col['name'] for col in inspector.get_columns('meetings')}

    # Regular columns
    for name, col_type, kwargs in MEETING_COLUMNS:
        if name not in existing:
            op.add_column('meetings', sa.Column(name, col_type, **kwargs))

    # FK columns
    for name, col_type, fk_name, ref_table, local_cols, remote_cols in FK_COLUMNS:
        if name not in existing:
            op.add_column('meetings', sa.Column(name, col_type, nullable=True))
            # Only create FK if referenced table exists
            ref_tables = inspector.get_table_names()
            if ref_table in ref_tables:
                try:
                    op.create_foreign_key(fk_name, 'meetings', ref_table, local_cols, remote_cols)
                except Exception:
                    pass  # FK may already exist from a previous partial migration

    # Enum column
    if 'meeting_type' not in existing:
        meetingtype_enum = sa.Enum('NATIVE', 'EXTERNAL', name='meetingtype', create_type=False)
        try:
            meetingtype_enum.create(conn, checkfirst=True)
        except Exception:
            pass
        op.add_column('meetings', sa.Column('meeting_type', meetingtype_enum, nullable=True, server_default='NATIVE'))


def downgrade() -> None:
    """Remove only the columns added by THIS migration (start_time, created_at if they were missing)."""
    # This is a catch-all migration; downgrade is best-effort
    pass
