const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const GetThread = require('../../Domains/threads/entities/GetThread');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread) {
        const { title, body, user_id } = newThread;
        const id = `thread-${this._idGenerator()}`;
        const created_at = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, user_id',
            values: [id, title, body, user_id, created_at],
        };

        const result = await this._pool.query(query);

        return new AddedThread(result.rows[0]);
    }

    async checkAvailabilityThread(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length === 0) {
            throw new NotFoundError('thread tidak ditemukan!');
        }
    }

    async getThread(id) {
        const query = {
            text: `
              SELECT threads.id, title, body, created_at AS date, username 
              FROM threads
              JOIN users ON users.id = threads.user_id 
              WHERE threads.id = $1
            `,
            values: [id],
        };

        const result = await this._pool.query(query);

        return new GetThread(result.rows[0]);
    }
}

module.exports = ThreadRepositoryPostgres;
