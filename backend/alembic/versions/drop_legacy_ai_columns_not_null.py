"""Drop NOT NULL constraint from legacy AI tables columns

Revision ID: b1c2d3e4f5g6
Revises: f6a7b8c9d0e1
Create Date: 2026-03-09 10:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'b1c2d3e4f5g6'
down_revision: Union[str, Sequence[str], None] = 'f6a7b8c9d0e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # 1. transcripts table legacy columns
    known_transcripts_cols = {'id', 'audio_file_id', 'meeting_id', 'segments', 'encrypted', 'detected_language', 'created_at'}
    if 'transcripts' in inspector.get_table_names():
        for col in inspector.get_columns('transcripts'):
            if col['name'] not in known_transcripts_cols and not col['nullable']:
                try:
                    op.alter_column('transcripts', col['name'], nullable=True)
                except Exception as e:
                    print(f"Warning: Could not alter transcripts.{col['name']} to nullable: {e}")

    # 2. translated_transcripts table
    known_translated_cols = {'id', 'transcript_id', 'audio_file_id', 'meeting_id', 'target_language', 'segments', 'encrypted', 'created_at'}
    if 'translated_transcripts' in inspector.get_table_names():
        for col in inspector.get_columns('translated_transcripts'):
            if col['name'] not in known_translated_cols and not col['nullable']:
                try:
                    op.alter_column('translated_transcripts', col['name'], nullable=True)
                except Exception as e:
                    pass

    # 3. meeting_summaries table
    known_summary_cols = {'id', 'transcript_id', 'meeting_id', 'executive_summary', 'key_points', 'decisions', 'risks', 'sentiment', 'encrypted', 'created_at'}
    if 'meeting_summaries' in inspector.get_table_names():
        for col in inspector.get_columns('meeting_summaries'):
            if col['name'] not in known_summary_cols and not col['nullable']:
                try:
                    op.alter_column('meeting_summaries', col['name'], nullable=True)
                except Exception as e:
                    pass

    # 4. extracted_action_items table
    known_action_items_cols = {'id', 'meeting_id', 'description', 'assignee', 'due_date', 'status', 'encrypted', 'created_at'}
    if 'extracted_action_items' in inspector.get_table_names():
        for col in inspector.get_columns('extracted_action_items'):
            if col['name'] not in known_action_items_cols and not col['nullable']:
                try:
                    op.alter_column('extracted_action_items', col['name'], nullable=True)
                except Exception as e:
                    pass
                    
    # 5. audio_files
    known_audio_files_cols = {'id', 'meeting_id', 's3_key', 'file_size', 'duration', 'processed', 'metadata', 'uploaded_at'}
    if 'audio_files' in inspector.get_table_names():
        for col in inspector.get_columns('audio_files'):
            if col['name'] not in known_audio_files_cols and not col['nullable']:
                try:
                    op.alter_column('audio_files', col['name'], nullable=True)
                except Exception as e:
                    pass


def downgrade() -> None:
    pass
