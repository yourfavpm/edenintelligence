"""Ensure all columns exist for transcripts and AI feature tables

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-03-05 03:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'f6a7b8c9d0e1'
down_revision: Union[str, Sequence[str], None] = 'e5f6a7b8c9d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # 1. transcripts table
    if 'transcripts' in inspector.get_table_names():
        cols = {c['name'] for c in inspector.get_columns('transcripts')}
        if 'meeting_id' not in cols:
            op.add_column('transcripts', sa.Column('meeting_id', sa.UUID(as_uuid=True), sa.ForeignKey('meetings.id'), nullable=True))
        if 'segments' not in cols:
            op.add_column('transcripts', sa.Column('segments', sa.Text(), nullable=False, server_default='[]'))
        if 'encrypted' not in cols:
            op.add_column('transcripts', sa.Column('encrypted', sa.Boolean(), nullable=True, server_default='false'))
        if 'detected_language' not in cols:
            op.add_column('transcripts', sa.Column('detected_language', sa.String(), nullable=True))
        
        # Alter columns to correctly nullable if they already exist from legacy schema
        for col in cols:
            if col in ['audio_file_id', 'meeting_id', 'segments']:
                pass # Already handled or explicitly required by our app logic, but segments might be empty for old ones 
    
    # 2. translated_transcripts table
    if 'translated_transcripts' in inspector.get_table_names():
        cols = {c['name'] for c in inspector.get_columns('translated_transcripts')}
        if 'audio_file_id' not in cols:
            op.add_column('translated_transcripts', sa.Column('audio_file_id', sa.UUID(as_uuid=True), sa.ForeignKey('audio_files.id'), nullable=True))
        if 'meeting_id' not in cols:
            op.add_column('translated_transcripts', sa.Column('meeting_id', sa.UUID(as_uuid=True), sa.ForeignKey('meetings.id'), nullable=True))
        if 'encrypted' not in cols:
            op.add_column('translated_transcripts', sa.Column('encrypted', sa.Boolean(), nullable=True, server_default='false'))

    # 3. meeting_summaries table
    if 'meeting_summaries' in inspector.get_table_names():
        cols = {c['name'] for c in inspector.get_columns('meeting_summaries')}
        if 'meeting_id' not in cols:
             op.add_column('meeting_summaries', sa.Column('meeting_id', sa.UUID(as_uuid=True), sa.ForeignKey('meetings.id'), nullable=True))

    # 4. extracted_action_items table
    if 'extracted_action_items' in inspector.get_table_names():
        cols = {c['name'] for c in inspector.get_columns('extracted_action_items')}
        if 'meeting_id' not in cols:
             op.add_column('extracted_action_items', sa.Column('meeting_id', sa.UUID(as_uuid=True), sa.ForeignKey('meetings.id'), nullable=True))

def downgrade() -> None:
    pass
