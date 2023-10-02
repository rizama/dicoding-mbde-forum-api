const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(replyData) {
        const { thread_id, comment_id, content, user_id } = replyData;
        const id = `reply-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const isDeleted = false;

        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, user_id',
            values: [
                id,
                content,
                thread_id,
                comment_id,
                user_id,
                isDeleted,
                createdAt,
            ],
        };

        const result = await this._pool.query(query);

        return new AddedReply(result.rows[0]);
    }

    async checkAvailabilityReply(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('balasan tidak ditemukan!');
        }
    }

    async verifyReplyOwner(replyId, userId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1 AND user_id = $2',
            values: [replyId, userId],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new AuthorizationError(
                'tidak bisa menghapus balasan orang lain.'
            );
        }
    }

    async deleteReply(replyId) {
        const deletedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE replies SET is_delete = $2, deleted_at = $3 WHERE id = $1',
            values: [replyId, true, deletedAt],
        };

        await this._pool.query(query);
    }

    async getReplies(threadId) {
        const query = {
            text: `SELECT replies.id, replies.comment_id, users.username, replies.created_at AS date, replies.content, replies.deleted_at, replies.is_delete FROM replies 
          LEFT JOIN comments ON comments.id = replies.comment_id
          LEFT JOIN users ON users.id = replies.user_id 
          WHERE replies.thread_id = $1 
          ORDER BY replies.created_at 
          ASC`,
            values: [threadId],
        };

        const { rows } = await this._pool.query(query);

        return rows;
    }
}

module.exports = ReplyRepositoryPostgres;
