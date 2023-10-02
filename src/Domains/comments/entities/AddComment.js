class AddComment {
    constructor(payload) {
        this._verifyPayload(payload);
        const { user_id, thread_id, content } = payload;
        this.user_id = user_id;
        this.thread_id = thread_id;
        this.content = content;
    }

    _verifyPayload({ user_id, thread_id, content }) {
        if (!user_id || !thread_id || !content) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof user_id !== 'string' ||
            typeof thread_id !== 'string' ||
            typeof content !== 'string'
        ) {
            throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;
