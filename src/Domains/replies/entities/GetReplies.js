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

        for (const reply of replies) {
            const id = 'id' in reply;
            const username = 'username' in reply;
            const date = 'date' in reply;
            const content = 'content' in reply;
            const is_delete = 'is_delete' in reply;

            if (!id || !username || !date || !content || !is_delete) {
                throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
            }
        }

        for (const reply of replies) {
            for (const key in reply) {
                if (
                    ['id', 'username', 'date', 'is_delete', 'content'].includes(
                        key
                    )
                ) {

                    if (key === 'is_delete') {
                        if (typeof reply[key] !== 'boolean') {
                            throw new Error(
                                'GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
                            );
                        }
                    } else if (typeof reply[key] !== 'string') {
                        throw new Error(
                            'GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
                        );
                    }
                }
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
        }));
    }
}

module.exports = GetReplies;
