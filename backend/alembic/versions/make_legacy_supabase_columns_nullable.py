"""Make legacy Supabase columns nullable

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-03-05 01:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, Sequence[str], None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # The Supabase database has Several columns that were created outside of our SQLAlchemy models.
    # Some of them (like workspace_id) have NOT NULL constraints, causing INSERTS to fail
    # because our backend doesn't know about them and leaves them null.
    # We alter them to be nullable here if they exist.
    
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_columns = {col['name'] for col in inspector.get_columns('meetings')}
    
    legacy_columns = [
        'workspace_id',
        'created_by',
        'source',
        'status',
        'failure_reason',
        'language_detected',
        'duration_seconds',
        'recording_object_path',
        'recording_mime',
        'started_at',
        'ended_at',
        'updated_at'
    ]
    
    for col in legacy_columns:
        if col in existing_columns:
            try:
                op.alter_column('meetings', col, nullable=True)
            except Exception as e:
                print(f"Warning: Could not alter column {col} to nullable: {e}")

def downgrade() -> None:
    pass
