const GetReplies = require('../GetReplies');

describe('a GetReplies entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply',
                    // is_delete: false, // is_delete is missing
                },
            ],
        };

        expect(() => new GetReplies(payload)).toThrow(
            'GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            replies: {},
        };

        const payload2 = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 1234,
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply',
                    is_delete: true,
                    comment_id: 'comment-sam',
                },
            ],
        };

        const payload3 = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'samsam',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply',
                    is_delete: 'true',
                    comment_id: 'comment-sam',
                },
            ],
        };

        expect(() => new GetReplies(payload)).toThrow(
            'GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
        expect(() => new GetReplies(payload2)).toThrow(
            'GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
        expect(() => new GetReplies(payload3)).toThrow(
            'GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should throw error when date is not string or Date instance', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'samsam',
                    date: 12345, // invalid date type
                    content: 'some reply',
                    is_delete: false,
                    comment_id: 'comment-sam',
                },
            ],
        };

        expect(() => new GetReplies(payload)).toThrow(
            'GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should accept both string and Date instance for date field', () => {
        const payload1 = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'samsam',
                    date: '2023-09-24 16:52:01.000Z', // string date
                    content: 'some reply',
                    is_delete: false,
                    comment_id: 'comment-sam',
                },
            ],
        };

        const payload2 = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'samsam',
                    date: new Date(), // Date instance
                    content: 'some reply',
                    is_delete: false,
                    comment_id: 'comment-sam',
                },
            ],
        };

        expect(() => new GetReplies(payload1)).not.toThrow();
        expect(() => new GetReplies(payload2)).not.toThrow();
    });

    it('should remap replies data correctly', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'samsamsam',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'sebuah reply',
                    is_delete: false,
                    comment_id: 'comment-sam',
                },
                {
                    id: 'reply-sim',
                    username: 'dicoding',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'balasan sudah dihapus',
                    is_delete: true,
                    comment_id: 'comment-sim',
                },
            ],
        };

        const { replies } = new GetReplies(payload);

        const expectedReplies = [
            {
                id: 'reply-sam',
                username: 'samsamsam',
                date: '2023-09-24 16:52:01.000Z',
                content: 'sebuah reply',
                comment_id: 'comment-sam',
            },
            {
                id: 'reply-sim',
                username: 'dicoding',
                date: '2023-09-24 16:52:01.000Z',
                content: '**balasan telah dihapus**',
                comment_id: 'comment-sim',
            },
        ];

        expect(replies).toEqual(expectedReplies);
    });

    it('should create GetReplies object correctly', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-samy',
                    username: 'kim jong kook',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply',
                    is_delete: true,
                    comment_id: 'comment-samy',
                },
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply',
                    is_delete: false,
                    comment_id: 'comment-sam',
                },
            ],
        };

        const expected = {
            replies: [
                {
                    id: 'reply-samy',
                    username: 'kim jong kook',
                    date: '2023-09-24 16:52:01.000Z',
                    content: '**balasan telah dihapus**',
                    comment_id: 'comment-samy',
                },
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply',
                    comment_id: 'comment-sam',
                },
            ],
        };

        const { replies } = new GetReplies(payload);

        expect(replies).toEqual(expected.replies);
    });
});
