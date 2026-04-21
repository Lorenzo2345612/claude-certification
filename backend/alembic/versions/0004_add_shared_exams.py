"""add shared_exams table and shared_exam_id to exam_attempts

Revision ID: 0004
Revises: 0003
Create Date: 2026-04-21

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect

revision: str = '0004'
down_revision: Union[str, Sequence[str], None] = '0003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa_inspect(bind)
    tables = inspector.get_table_names()

    if 'shared_exams' not in tables:
        op.create_table(
            'shared_exams',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('creator_id', sa.Integer(), nullable=False),
            sa.Column('title', sa.String(255), nullable=False),
            sa.Column('question_ids', sa.JSON(), nullable=False),
            sa.Column('time_limit_minutes', sa.Integer(), nullable=True),
            sa.Column('domains_selected', sa.JSON(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP")),
            sa.ForeignKeyConstraint(['creator_id'], ['users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )

    existing_cols = [c['name'] for c in inspector.get_columns('exam_attempts')]
    if 'shared_exam_id' not in existing_cols:
        op.add_column(
            'exam_attempts',
            sa.Column('shared_exam_id', sa.Integer(), sa.ForeignKey('shared_exams.id', ondelete='SET NULL'), nullable=True)
        )


def downgrade() -> None:
    op.drop_column('exam_attempts', 'shared_exam_id')
    op.drop_table('shared_exams')
