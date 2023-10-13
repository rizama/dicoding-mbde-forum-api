const InvariantError = require('../../Commons/exceptions/InvariantError');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(addLike) {
        const { thread_id, comment_id, user_id } = addLike;
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, thread_id, comment_id, user_id],
        };

        const { rows } = await this._pool.query(query);

        return rows[0].id;
    }

    async verifyAvailableLike(thread_id, comment_id, user_id) {
        const query = {
            text: 'SELECT id FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
            values: [thread_id, comment_id, user_id],
        };

        const { rowCount, rows } = await this._pool.query(query);

        if (rowCount === 0) return null;
        return rows[0].id;
    }

    async deleteLike(id) {
        const query = {
            text: 'DELETE FROM likes WHERE id = $1 RETURNING id',
            values: [id],
        };

        const { rowCount } = await this._pool.query(query);

        if (rowCount === 0) {
            throw new InvariantError('No Row Affected, Gagal menghapus like');
        }
    }

    async getLikeByThreadId(thread_id) {
        const query = {
            text: 'SELECT id, comment_id, thread_id FROM likes WHERE thread_id = $1',
            values: [thread_id],
        };

        const { rows } = await this._pool.query(query);

        return rows;
    }
}

module.exports = LikeRepositoryPostgres;
