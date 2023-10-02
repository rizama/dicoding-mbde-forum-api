/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-sam',
        thread_id = 'thread-sam',
        content = 'komentar netizen',
        user_id = 'user-sam',
    }) {
        const createdAt = new Date().toISOString();
        const isDelete = false;
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, content, user_id, thread_id, isDelete, createdAt],
        };

        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async checkdeletedAtCommentsById(id) {
        const query = {
            text: 'SELECT is_delete FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        const isDelete = result.rows[0].is_delete;
        return isDelete;
    },

    async deleteCommentsById(id) {
        const deletedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE comments SET is_delete = $2, deleted_at = $3 WHERE id = $1',
            values: [id, true, deletedAt],
        };
        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;
