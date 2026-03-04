"""Add organizer_id, organization_id, language to meetings

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-04 20:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add remaining missing columns to the meetings table."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_columns = {col['name'] for col in inspector.get_columns('meetings')}
    
    if 'language' not in existing_columns:
        op.add_column('meetings', sa.Column('language', sa.String(), nullable=True, server_default='en'))
    
    if 'organizer_id' not in existing_columns:
        op.add_column('meetings', sa.Column('organizer_id', postgresql.UUID(as_uuid=True), nullable=True))
        op.create_foreign_key('fk_meetings_organizer_id', 'meetings', 'users', ['organizer_id'], ['id'])
    
    if 'organization_id' not in existing_columns:
        op.add_column('meetings', sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=True))
        op.create_foreign_key('fk_meetings_organization_id', 'meetings', 'organizations', ['organization_id'], ['id'])


def downgrade() -> None:
    """Remove the columns added."""
    op.drop_constraint('fk_meetings_organization_id', 'meetings', type_='foreignkey')
    op.drop_constraint('fk_meetings_organizer_id', 'meetings', type_='foreignkey')
    op.drop_column('meetings', 'organization_id')
    op.drop_column('meetings', 'organizer_id')
    op.drop_column('meetings', 'language')
