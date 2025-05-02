const GetComment = require('../GetComment');

describe('a GetComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            comments: [
                {
                    id: 'comment-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some comment',
                    deleted_at: '',
                    // is_delete: false, // is_delete is missing
                },
            ],
        };

        expect(() => new GetComment(payload)).toThrow(
            'GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            comments: {},
        };

        const payload2 = {
            comments: [
                {
                    id: 'comment-sam',
                    username: 1234,
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some comment',
                    deleted_at: '',
                    is_delete: true,
                },
            ],
        };

        const payload3 = {
            comments: [
                {
                    id: 'reply-sam',
                    username: 'samsam',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '',
                    is_delete: 'true',
                },
            ],
        };

        expect(() => new GetComment(payload)).toThrow(
            'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
        expect(() => new GetComment(payload2)).toThrow(
            'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
        expect(() => new GetComment(payload3)).toThrow(
            'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should throw error when date is not string or Date instance', () => {
        const payload = {
            comments: [
                {
                    id: 'comment-sam',
                    username: 'samsam',
                    date: 12345, // invalid date type
                    content: 'some comment',
                    is_delete: false,
                },
            ],
        };

        expect(() => new GetComment(payload)).toThrow(
            'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should accept both string and Date instance for date field', () => {
        const payload1 = {
            comments: [
                {
                    id: 'comment-sam',
                    username: 'samsam',
                    date: '2023-09-24 16:52:01.000Z', // string date
                    content: 'some comment',
                    is_delete: false,
                },
            ],
        };

        const payload2 = {
            comments: [
                {
                    id: 'comment-sam',
                    username: 'samsam',
                    date: new Date(), // Date instance
                    content: 'some comment',
                    is_delete: false,
                },
            ],
        };

        expect(() => new GetComment(payload1)).not.toThrow();
        expect(() => new GetComment(payload2)).not.toThrow();
    });

    it('should remap comments data correctly', () => {
        const payload = {
            comments: [
                {
                    id: 'comment-sam',
                    username: 'samsamsam',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'sebuah comment',
                    is_delete: false,
                },
                {
                    id: 'comment-sim',
                    username: 'dicoding',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'komentar sudah dihapus',
                    is_delete: true,
                },
            ],
        };

        const { comments } = new GetComment(payload);

        const expectedComment = [
            {
                id: 'comment-sam',
                username: 'samsamsam',
                date: '2023-09-24 16:52:01.000Z',
                content: 'sebuah comment',
            },
            {
                id: 'comment-sim',
                username: 'dicoding',
                date: '2023-09-24 16:52:01.000Z',
                content: '**komentar telah dihapus**',
            },
        ];

        expect(comments).toEqual(expectedComment);
    });

    it('should create GetComment object correctly', () => {
        const payload = {
            comments: [
                {
                    id: 'comment-samy',
                    username: 'kim jong kook',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '2023-09-24 17:52:01.000Z',
                    is_delete: true,
                },
                {
                    id: 'comment-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                    deleted_at: '2023-09-24 17:52:01.000Z',
                    is_delete: false,
                },
            ],
        };

        const expected = {
            comments: [
                {
                    id: 'comment-samy',
                    username: 'kim jong kook',
                    date: '2023-09-24 16:52:01.000Z',
                    content: '**komentar telah dihapus**',
                },
                {
                    id: 'comment-sam',
                    username: 'yoo jae suk',
                    date: '2023-09-24 16:52:01.000Z',
                    content: 'some reply a comment',
                },
            ],
        };

        const { comments } = new GetComment(payload);

        expect(comments).toEqual(expected.comments);
    });
});
