class AddLike {
    constructor(payload) {
        this._verifyPayload(payload);
        const { thread_id, comment_id, user_id } = payload;

        this.thread_id = thread_id;
        this.comment_id = comment_id;
        this.user_id = user_id;
    }

    _verifyPayload({ thread_id, comment_id, user_id }) {
        if (!thread_id || !comment_id || !user_id) {
            throw new Error('REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof thread_id !== 'string' ||
            typeof comment_id !== 'string' ||
            typeof user_id !== 'string'
        ) {
            throw new Error('REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddLike;
