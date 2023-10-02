const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(newComment) {
        const { content, thread_id, user_id } = newComment;
        const id = `comment-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const isDelete = false;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5 ,$6) RETURNING id, content, user_id',
            values: [id, content, user_id, thread_id, isDelete, createdAt],
        };

        const result = await this._pool.query(query);

        return new AddedComment(result.rows[0]);
    }

    async checkAvailabilityComment(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('komentar tidak ditemukan!');
        }
    }

    async verifyCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
            values: [commentId, userId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new AuthorizationError(
                'tidak bisa menghapus komentar orang lain.'
            );
        }
    }

    async deleteComment(commentId) {
        const isDelete = true;
        const deletedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE comments SET is_delete = $2, deleted_at = $3 WHERE id = $1',
            values: [commentId, isDelete, deletedAt],
        };

        await this._pool.query(query);
    }

    async getComments(threadId) {
        const query = {
            text: `SELECT comments.id, comments.thread_id, users.username, comments.created_at AS date, comments.content, comments.is_delete 
            FROM comments 
            LEFT JOIN threads ON threads.id = comments.thread_id 
            LEFT JOIN users ON users.id = comments.user_id
            WHERE comments.thread_id = $1 
            ORDER BY comments.created_at 
            ASC`,
            values: [threadId],
        };

        const { rows } = await this._pool.query(query);

        return rows;
    }
}

module.exports = CommentRepositoryPostgres;
