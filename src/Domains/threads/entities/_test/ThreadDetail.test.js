const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            thread: {
                id: 'thread-123',
                title: 'Test Thread',
                body: 'Test Body',
                date: '2023-01-01',
                username: 'user123'
            },
            comments: [],
            replies: []
            // missing likes property
        };

        // Action & Assert
        expect(() => new ThreadDetail(payload)).toThrow('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            thread: {
                id: 'thread-123',
                title: 'Test Thread',
                body: 'Test Body',
                date: '2023-01-01',
                username: 'user123'
            },
            comments: 'not an array', // should be array
            replies: [],
            likes: []
        };

        // Action & Assert
        expect(() => new ThreadDetail(payload)).toThrow('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create thread detail object correctly', () => {
        // Arrange
        const payload = {
            thread: {
                id: 'thread-123',
                title: 'Test Thread',
                body: 'Test Body',
                date: '2023-01-01',
                username: 'user123'
            },
            comments: [
                {
                    id: 'comment-123',
                    username: 'user456',
                    date: '2023-01-02',
                    content: 'Test Comment',
                    is_delete: false
                }
            ],
            replies: [
                {
                    id: 'reply-123',
                    content: 'Test Reply',
                    date: '2023-01-03',
                    username: 'user789',
                    comment_id: 'comment-123',
                    is_delete: false
                }
            ],
            likes: [
                {
                    id: 'like-123',
                    comment_id: 'comment-123',
                    user_id: 'user999'
                }
            ]
        };

        // Action
        const threadDetail = new ThreadDetail(payload);

        // Assert
        expect(threadDetail.id).toEqual(payload.thread.id);
        expect(threadDetail.title).toEqual(payload.thread.title);
        expect(threadDetail.body).toEqual(payload.thread.body);
        expect(threadDetail.date).toEqual(payload.thread.date);
        expect(threadDetail.username).toEqual(payload.thread.username);
        expect(threadDetail.comments).toHaveLength(1);
        expect(threadDetail.comments[0].id).toEqual(payload.comments[0].id);
        expect(threadDetail.comments[0].content).toEqual(payload.comments[0].content);
        expect(threadDetail.comments[0].date).toEqual(payload.comments[0].date);
        expect(threadDetail.comments[0].username).toEqual(payload.comments[0].username);

        expect(threadDetail.comments[0].replies).toHaveLength(1);
        expect(threadDetail.comments[0].replies[0].id).toEqual(payload.replies[0].id);
        expect(threadDetail.comments[0].replies[0].content).toEqual(payload.replies[0].content);
        expect(threadDetail.comments[0].replies[0].date).toEqual(payload.replies[0].date);
        expect(threadDetail.comments[0].replies[0].username).toEqual(payload.replies[0].username);
        expect(threadDetail.comments[0].likeCount).toEqual(1);
    });

    it('should handle multiple comments and replies correctly', () => {
        // Arrange
        const payload = {
            thread: {
                id: 'thread-123',
                title: 'Test Thread',
                body: 'Test Body',
                date: '2023-01-01',
                username: 'user123'
            },
            comments: [
                {
                    id: 'comment-1',
                    username: 'user1',
                    date: '2023-01-02',
                    content: 'Comment 1',
                    is_delete: false
                },
                {
                    id: 'comment-2',
                    username: 'user2',
                    date: '2023-01-03',
                    content: 'Comment 2',
                    is_delete: false
                }
            ],
            replies: [
                {
                    id: 'reply-1',
                    username: 'user3',
                    date: '2023-01-04',
                    content: 'Reply 1',
                    comment_id: 'comment-1',
                    is_delete: false
                },
                {
                    id: 'reply-2',
                    content: 'Reply 2',
                    date: '2023-01-05',
                    username: 'user4',
                    comment_id: 'comment-2',
                    is_delete: false
                }
            ],
            likes: [
                {
                    id: 'like-1',
                    comment_id: 'comment-1',
                    user_id: 'user5'
                },
                {
                    id: 'like-2',
                    comment_id: 'comment-1',
                    user_id: 'user6'
                }
            ]
        };

        // Action
        const threadDetail = new ThreadDetail(payload);

        // Assert
        expect(threadDetail.comments).toHaveLength(2);
        expect(threadDetail.comments[0].replies).toHaveLength(1);
        expect(threadDetail.comments[1].replies).toHaveLength(1);
        expect(threadDetail.comments[0].likeCount).toEqual(2);
        expect(threadDetail.comments[1].likeCount).toEqual(0);
    });
}); 