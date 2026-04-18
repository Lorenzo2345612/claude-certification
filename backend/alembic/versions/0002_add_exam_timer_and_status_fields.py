"""add exam timer and status fields

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-18 13:23:47.489803

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0002'
down_revision: Union[str, Sequence[str], None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('exam_attempts', sa.Column('time_limit_minutes', sa.Integer(), nullable=True))
    op.add_column('exam_attempts', sa.Column('status', sa.String(20), nullable=False, server_default='completed'))


def downgrade() -> None:
    op.drop_column('exam_attempts', 'status')
    op.drop_column('exam_attempts', 'time_limit_minutes')
