class GetComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const comments = this._transformComments(payload);
        this.comments = comments;
    }

    _verifyPayload({ comments }) {
        if (!Array.isArray(comments)) {
            throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        for (const comment of comments) {
            const id = 'id' in comment;
            const username = 'username' in comment;
            const date = 'date' in comment;
            const content = 'content' in comment;
            const is_delete = 'is_delete' in comment;

            if (!id || !username || !date || !content || !is_delete) {
                throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
            }
        }

        for (const comment of comments) {
            for (const key in comment) {
                if (
                    ['id', 'username', 'date', 'is_delete', 'content'].includes(
                        key
                    )
                ) {
                    if (key === 'is_delete') {
                        if (typeof comment[key] !== 'boolean') {
                            throw new Error(
                                'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
                            );
                        }
                    } else if (typeof comment[key] !== 'string') {
                        throw new Error(
                            'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
                        );
                    }
                }
            }
        }
    }

    _transformComments({ comments }) {
        return comments.map((comment) => ({
            id: comment.id,
            username: comment.username,
            date: comment.date,
            content: comment.is_delete
                ? '**komentar telah dihapus**'
                : comment.content,
        }));
    }
}

module.exports = GetComment;
