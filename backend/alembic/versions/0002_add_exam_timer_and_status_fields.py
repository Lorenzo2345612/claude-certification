"""add exam timer and status fields

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-18 13:23:47.489803

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect

revision: str = '0002'
down_revision: Union[str, Sequence[str], None] = '0001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def column_exists(table, column):
    bind = op.get_bind()
    inspector = sa_inspect(bind)
    columns = [c['name'] for c in inspector.get_columns(table)]
    return column in columns


def upgrade() -> None:
    if not column_exists('exam_attempts', 'time_limit_minutes'):
        op.add_column('exam_attempts', sa.Column('time_limit_minutes', sa.Integer(), nullable=True))
    if not column_exists('exam_attempts', 'status'):
        op.add_column('exam_attempts', sa.Column('status', sa.String(20), nullable=False, server_default='completed'))


def downgrade() -> None:
    op.drop_column('exam_attempts', 'status')
    op.drop_column('exam_attempts', 'time_limit_minutes')
