"""add course_keys to questions, course_key/optional_in/verification to learn_topics, course_keys_selected to shared_exams

Revision ID: 0005
Revises: 0004
Create Date: 2026-04-29

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect as sa_inspect

revision: str = '0005'
down_revision: Union[str, Sequence[str], None] = '0004'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _has_column(inspector, table: str, column: str) -> bool:
    return column in [c['name'] for c in inspector.get_columns(table)]


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa_inspect(bind)

    if not _has_column(inspector, 'questions', 'course_keys'):
        op.add_column('questions', sa.Column('course_keys', sa.JSON(), nullable=True))

    if not _has_column(inspector, 'learn_topics', 'course_key'):
        op.add_column('learn_topics', sa.Column('course_key', sa.String(50), nullable=True))
        op.create_index('ix_learn_topics_course_key', 'learn_topics', ['course_key'])
    if not _has_column(inspector, 'learn_topics', 'optional_in'):
        op.add_column('learn_topics', sa.Column('optional_in', sa.JSON(), nullable=True))
    if not _has_column(inspector, 'learn_topics', 'verification'):
        op.add_column('learn_topics', sa.Column('verification', sa.String(30), nullable=True))
    if not _has_column(inspector, 'learn_topics', 'verification_note'):
        op.add_column('learn_topics', sa.Column('verification_note', sa.Text(), nullable=True))

    if not _has_column(inspector, 'shared_exams', 'course_keys_selected'):
        op.add_column('shared_exams', sa.Column('course_keys_selected', sa.JSON(), nullable=True))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa_inspect(bind)

    if _has_column(inspector, 'shared_exams', 'course_keys_selected'):
        op.drop_column('shared_exams', 'course_keys_selected')

    if _has_column(inspector, 'learn_topics', 'verification_note'):
        op.drop_column('learn_topics', 'verification_note')
    if _has_column(inspector, 'learn_topics', 'verification'):
        op.drop_column('learn_topics', 'verification')
    if _has_column(inspector, 'learn_topics', 'optional_in'):
        op.drop_column('learn_topics', 'optional_in')
    if _has_column(inspector, 'learn_topics', 'course_key'):
        try:
            op.drop_index('ix_learn_topics_course_key', table_name='learn_topics')
        except Exception:
            pass
        op.drop_column('learn_topics', 'course_key')

    if _has_column(inspector, 'questions', 'course_keys'):
        op.drop_column('questions', 'course_keys')
