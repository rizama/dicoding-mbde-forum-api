/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
    async addLike({
        id = 'like-sam',
        threadId = 'thread-sam',
        commentId = 'comment-sam',
        user_id = 'user-sam',
    }) {
        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
            values: [id, threadId, commentId, user_id],
        };

        await pool.query(query);
    },

    async findLikeById(id) {
        const query = {
            text: 'SELECT * FROM likes WHERE id = $1',
            values: [id],
        };

        const { rows } = await pool.query(query);
        return rows;
    },

    async findLike(threadId, commentId, userId) {
        const query = {
            text: 'SELECT id FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3',
            values: [threadId, commentId, userId],
        };

        const { rows } = await pool.query(query);
        return rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes WHERE 1=1');
    },
};

module.exports = LikesTableTestHelper;
