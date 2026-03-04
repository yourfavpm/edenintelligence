"""Add missing columns to meetings table

Revision ID: a1b2c3d4e5f6
Revises: 46ed342843f4
Create Date: 2026-03-04 20:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '46ed342843f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add columns that may be missing from the meetings table.
    
    The initial migration skipped if the table already existed (created via Supabase UI).
    This migration safely adds each column only if it doesn't already exist.
    """
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    # Get existing column names for the meetings table
    existing_columns = {col['name'] for col in inspector.get_columns('meetings')}
    
    # --- Core columns ---
    if 'description' not in existing_columns:
        op.add_column('meetings', sa.Column('description', sa.Text(), nullable=True))
    
    if 'language' not in existing_columns:
        op.add_column('meetings', sa.Column('language', sa.String(), nullable=True, server_default='en'))
    
    if 'duration_minutes' not in existing_columns:
        op.add_column('meetings', sa.Column('duration_minutes', sa.Integer(), nullable=True))
    
    if 'end_time' not in existing_columns:
        op.add_column('meetings', sa.Column('end_time', sa.DateTime(timezone=True), nullable=True))
    
    # --- Foreign key columns ---
    if 'organizer_id' not in existing_columns:
        op.add_column('meetings', sa.Column('organizer_id', sa.dialects.postgresql.UUID(as_uuid=True), nullable=True))
        # Add foreign key constraint
        op.create_foreign_key('fk_meetings_organizer_id', 'meetings', 'users', ['organizer_id'], ['id'])
    
    if 'organization_id' not in existing_columns:
        op.add_column('meetings', sa.Column('organization_id', sa.dialects.postgresql.UUID(as_uuid=True), nullable=True))
        op.create_foreign_key('fk_meetings_organization_id', 'meetings', 'organizations', ['organization_id'], ['id'])
    
    # --- Feature columns ---
    if 'external_link' not in existing_columns:
        op.add_column('meetings', sa.Column('external_link', sa.String(), nullable=True))
    
    if 'ai_transcription' not in existing_columns:
        op.add_column('meetings', sa.Column('ai_transcription', sa.Boolean(), nullable=True, server_default='false'))
    
    if 'ai_translation' not in existing_columns:
        op.add_column('meetings', sa.Column('ai_translation', sa.Boolean(), nullable=True, server_default='false'))
    
    if 'ai_recording' not in existing_columns:
        op.add_column('meetings', sa.Column('ai_recording', sa.Boolean(), nullable=True, server_default='false'))
    
    # --- Enum column ---
    if 'meeting_type' not in existing_columns:
        meetingtype_enum = sa.Enum('NATIVE', 'EXTERNAL', name='meetingtype', create_type=False)
        try:
            meetingtype_enum.create(conn, checkfirst=True)
        except Exception:
            pass
        op.add_column('meetings', sa.Column('meeting_type', meetingtype_enum, nullable=True, server_default='NATIVE'))


def downgrade() -> None:
    """Remove columns added in this migration."""
    op.drop_constraint('fk_meetings_organization_id', 'meetings', type_='foreignkey')
    op.drop_constraint('fk_meetings_organizer_id', 'meetings', type_='foreignkey')
    op.drop_column('meetings', 'ai_recording')
    op.drop_column('meetings', 'ai_translation')
    op.drop_column('meetings', 'ai_transcription')
    op.drop_column('meetings', 'external_link')
    op.drop_column('meetings', 'organization_id')
    op.drop_column('meetings', 'organizer_id')
    op.drop_column('meetings', 'end_time')
    op.drop_column('meetings', 'duration_minutes')
    op.drop_column('meetings', 'language')
    op.drop_column('meetings', 'description')
    op.drop_column('meetings', 'meeting_type')
