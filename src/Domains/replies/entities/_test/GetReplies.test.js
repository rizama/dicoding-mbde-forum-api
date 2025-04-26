const GetReplies = require('../GetReplies');

describe('a GetReplies entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '',
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
                    content: 'some reply a comment',
                    deleted_at: '',
                    is_delete: true,
                },
            ],
        };

        const payload3 = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'samtampan',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '',
                    is_delete: 'sam',
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

    it('should remap replies data correctly', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '',
                    is_delete: false,
                },
            ],
        };

        const { replies } = new GetReplies(payload);

        const expectedReply = [
            {
                id: 'reply-sam',
                username: 'yoo jae suk',
                date: '2023-09-24 16:52:01.000Z',
                content: 'some reply a comment',
            },
        ];

        expect(replies).toEqual(expectedReply);
    });

    it('should create GetReplies object correctly', () => {
        const payload = {
            replies: [
                {
                    id: 'reply-samy',
                    username: 'kim jong kook',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '2023-09-24 17:52:01.000Z',
                    is_delete: true,
                },
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '2023-09-24 17:52:01.000Z',
                    is_delete: false,
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
                },
                {
                    id: 'reply-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                },
            ],
        };

        const { replies } = new GetReplies(payload);

        expect(replies).toEqual(expected.replies);
    });
});
