const ThreadUseCase = require('../ThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('ThreadUseCase', () => {
    describe('addThread function', () => {
        it('should orchestrating the add thread action correctly', async () => {
            // Arrange
            const useCasePayload = {
                title: 'some thread',
                body: 'some body thread',
                user_id: 'user-123',
            };

            const mockAddedThread = new AddedThread({
                id: 'thread-askdjlkasjd',
                title: useCasePayload.title,
                body: useCasePayload.body,
                user_id: useCasePayload.user_id,
            });

            const mockThreadRepository = new ThreadRepository();
            mockThreadRepository.addThread = jest.fn(() =>
                Promise.resolve(mockAddedThread)
            );

            const getThreadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: {},
                replyRepository: {},
            });

            // Action
            const addedThread = await getThreadUseCase.addThread(
                useCasePayload
            );

            // Assert
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: 'thread-askdjlkasjd',
                    title: useCasePayload.title,
                    body: useCasePayload.body,
                    user_id: useCasePayload.user_id,
                })
            );
            expect(mockThreadRepository.addThread).toBeCalledWith(
                new AddThread({
                    title: useCasePayload.title,
                    body: useCasePayload.body,
                    user_id: useCasePayload.user_id,
                })
            );
        });
    });

    describe('getThread function', () => {
        it('should get return detail thread correctly', async () => {
            // Arrange
            const expectedThread = new GetThread({
                id: 'thread-98765',
                title: 'title of thread',
                body: 'some content body',
                date: '2023-09-22',
                username: 'sampratama',
            });
            const expectedComments = [
                {
                    id: 'comment-12345',
                    content: 'some content comment',
                    username: 'rizkysamp',
                    thread_id: 'thread-98765',
                    date: '2023-09-22T13:20:00.000Z',
                    is_delete: false,
                },
                {
                    id: 'comment-67890',
                    content: 'some content comment',
                    username: 'rizkypratama',
                    thread_id: 'thread-98765',
                    date: '2023-09-23T13:20:00.000Z',
                    is_delete: false,
                },
            ];

            const expectedReplies = [
                {
                    id: 'reply-1998',
                    content: 'reply reply',
                    date: '2023-09-22T14:20:00.000Z',
                    username: 'songjihyo',
                    thread_id: 'thread-98765',
                    comment_id: 'comment-67890',
                    is_delete: false,
                },
            ];

            // Test Double
            const threadId = 'thread-98765';
            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = new CommentRepository();
            const mockReplyRepository = new ReplyRepository();

            mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
                Promise.resolve()
            );
            mockThreadRepository.getThread = jest.fn(() =>
                Promise.resolve(expectedThread)
            );

            mockCommentRepository.getComments = jest.fn(() =>
                Promise.resolve(expectedComments)
            );

            mockReplyRepository.getReplies = jest.fn(() =>
                Promise.resolve(expectedReplies)
            );

            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
                replyRepository: mockReplyRepository,
            });

            // Action
            const detailThread = await threadUseCase.getThread(threadId);

            expect(
                mockThreadRepository.checkAvailabilityThread
            ).toHaveBeenCalledWith(threadId);

            expect(mockThreadRepository.getThread).toHaveBeenCalledWith(
                threadId
            );
            expect(mockCommentRepository.getComments).toHaveBeenCalledWith(
                threadId
            );
            expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(
                threadId
            );

            expect(detailThread).toStrictEqual({
                thread: {
                    id: 'thread-98765',
                    title: 'title of thread',
                    body: 'some content body',
                    date: '2023-09-22T00:00:00.000Z',
                    username: 'sampratama',
                    comments: [
                        {
                            id: 'comment-12345',
                            username: 'rizkysamp',
                            date: '2023-09-22T13:20:00.000Z',
                            content: 'some content comment',
                            replies: [],
                        },
                        {
                            id: 'comment-67890',
                            username: 'rizkypratama',
                            date: '2023-09-23T13:20:00.000Z',
                            content: 'some content comment',
                            replies: [
                                {
                                    id: 'reply-1998',
                                    username: 'songjihyo',
                                    date: '2023-09-22T14:20:00.000Z',
                                    content: 'reply reply',
                                },
                            ],
                        },
                    ],
                },
            });
        });
    });
});
