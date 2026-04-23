"""Initial migration

Revision ID: 001
Revises:
Create Date: 2024-01-01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(), nullable=False, unique=True, index=True),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('employee','manager','hr','admin', name='roleenum'), default='employee'),
        sa.Column('department', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
    )
    op.create_table(
        'programs',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('difficulty', sa.Enum('beginner','intermediate','advanced', name='difficultyenum'), default='beginner'),
        sa.Column('duration_hrs', sa.Float(), default=0),
        sa.Column('skills', postgresql.JSON(), default=list),
        sa.Column('provider', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
    )
    op.create_table(
        'enrollments',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('employee_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('program_id',  sa.Integer(), sa.ForeignKey('programs.id'), nullable=False),
        sa.Column('status', sa.Enum('not_started','in_progress','completed','dropped', name='statusenum'), default='not_started'),
        sa.Column('progress', sa.Float(), default=0.0),
        sa.Column('enrolled_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
    )

def downgrade():
    op.drop_table('enrollments')
    op.drop_table('programs')
    op.drop_table('users')
