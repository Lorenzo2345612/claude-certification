"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-04-18 13:23:12.472196

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '0001'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_users_username', 'users', ['username'], unique=True)

    op.create_table(
        'notes',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.String(100), nullable=False),
        sa.Column('content', sa.Text(), nullable=False, server_default=''),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'topic_id', name='uq_user_topic'),
    )
    op.create_index('ix_notes_topic_id', 'notes', ['topic_id'])

    op.create_table(
        'progress',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.String(100), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'topic_id', name='uq_user_progress'),
    )
    op.create_index('ix_progress_topic_id', 'progress', ['topic_id'])

    op.create_table(
        'questions',
        sa.Column('id', sa.Integer(), autoincrement=False, nullable=False),
        sa.Column('domain_id', sa.Integer(), nullable=False),
        sa.Column('domain', sa.String(200), nullable=False),
        sa.Column('scenario', sa.String(500), server_default=''),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('options', sa.JSON(), nullable=False),
        sa.Column('correct_answer', sa.String(10), nullable=False),
        sa.Column('explanation', sa.Text(), server_default=''),
        sa.Column('why_others_wrong', sa.JSON()),
        sa.Column('doc_reference', sa.JSON()),
        sa.Column('doc_status', sa.String(50)),
        sa.Column('skilljar_ref', sa.JSON()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_questions_domain_id', 'questions', ['domain_id'])

    op.create_table(
        'learn_topics',
        sa.Column('id', sa.String(100), nullable=False),
        sa.Column('domain_id', sa.Integer(), nullable=False),
        sa.Column('domain', sa.String(200), nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('content', sa.Text(), nullable=False, server_default=''),
        sa.Column('doc_url', sa.String(500)),
        sa.Column('doc_label', sa.String(200)),
        sa.Column('related_topics', sa.JSON()),
        sa.Column('skilljar_refs', sa.JSON()),
        sa.Column('anthropic_docs_ref', sa.JSON()),
        sa.Column('summary', sa.Text()),
        sa.Column('key_concepts', sa.JSON()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_learn_topics_domain_id', 'learn_topics', ['domain_id'])

    op.create_table(
        'exam_attempts',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('total_questions', sa.Integer(), nullable=False),
        sa.Column('correct_count', sa.Integer(), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('passed', sa.Boolean(), nullable=False),
        sa.Column('domains_selected', sa.JSON(), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table(
        'exam_answers',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('attempt_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('domain_id', sa.Integer(), nullable=False),
        sa.Column('selected_answer', sa.String(10), nullable=False),
        sa.Column('correct_answer', sa.String(10), nullable=False),
        sa.Column('is_correct', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['attempt_id'], ['exam_attempts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('exam_answers')
    op.drop_table('exam_attempts')
    op.drop_table('learn_topics')
    op.drop_table('questions')
    op.drop_table('progress')
    op.drop_table('notes')
    op.drop_table('users')
