class GetReplies {
    constructor(payload) {
        this._verifyPayload(payload);
        const replies = this._transformReplies(payload);
        this.replies = replies;
    }

    _verifyPayload({ replies }) {
        if (!Array.isArray(replies)) {
            throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        const requiredProperties = ['id', 'username', 'date', 'content', 'is_delete', 'comment_id'];
        const stringProperties = ['id', 'username', 'content', 'comment_id'];

        for (const reply of replies) {
            // Check required properties
            const missingProperties = requiredProperties.filter(prop => !(prop in reply));
            if (missingProperties.length > 0) {
                throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
            }

            // Check data types
            for (const prop of stringProperties) {
                if (typeof reply[prop] !== 'string') {
                    throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
                }
            }

            // Check date type
            if (!(typeof reply.date === 'string' || reply.date instanceof Date)) {
                throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
            }

            // Check is_delete type
            if (typeof reply.is_delete !== 'boolean') {
                throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
            }
        }
    }

    _transformReplies({ replies }) {
        return replies.map((reply) => ({
            id: reply.id,
            username: reply.username,
            date: reply.date,
            content: reply.is_delete
                ? '**balasan telah dihapus**'
                : reply.content,
            comment_id: reply.comment_id
        }));
    }
}

module.exports = GetReplies;
