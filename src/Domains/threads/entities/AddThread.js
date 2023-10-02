class AddThread {
    constructor(payload) {
        this._verifyPayload(payload);

        this.title = payload.title;
        this.body = payload.body;
        this.user_id = payload.user_id;
    }

    _verifyPayload({ title, body, user_id }) {
        if (!title || !body || !user_id) {
            throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof title !== 'string' ||
            typeof body !== 'string' ||
            typeof user_id !== 'string'
        ) {
            throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (title.length > 50) {
            throw new Error(
                'ADD_THREAD.TITLE_LIMIT_CHAR'
            );
        }
    }
}

module.exports = AddThread;
