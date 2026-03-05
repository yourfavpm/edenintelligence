"""Add audio_file_id to transcripts table

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-03-05 02:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'e5f6a7b8c9d0'
down_revision: Union[str, Sequence[str], None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add audio_file_id to transcripts table safely
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_columns = {col['name'] for col in inspector.get_columns('transcripts')}

    if 'audio_file_id' not in existing_columns:
        op.add_column('transcripts', sa.Column('audio_file_id', sa.UUID(as_uuid=True), nullable=True))
        op.create_foreign_key(
            'fk_transcripts_audio_file_id',
            'transcripts',
            'audio_files',
            ['audio_file_id'],
            ['id'],
            ondelete='SET NULL'
        )

def downgrade() -> None:
    pass
