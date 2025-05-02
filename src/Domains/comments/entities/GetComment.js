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

        const requiredProperties = ['id', 'username', 'date', 'content', 'is_delete'];
        const stringProperties = ['id', 'username', 'content'];

        for (const comment of comments) {
            // Check required properties
            const missingProperties = requiredProperties.filter(prop => !(prop in comment));
            if (missingProperties.length > 0) {
                throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
            }

            // Check data types
            for (const prop of stringProperties) {
                if (typeof comment[prop] !== 'string') {
                    throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
                }
            }

            // Check date type
            if (!(typeof comment.date === 'string' || comment.date instanceof Date)) {
                throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
            }

            // Check is_delete type
            if (typeof comment.is_delete !== 'boolean') {
                throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
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
