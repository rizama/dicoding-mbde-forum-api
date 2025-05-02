const ThreadUseCase = require('../ThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

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
            expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
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

            const expectedLikes = [
                {
                    id: 'reply-1998',
                    thread_id: 'thread-98765',
                    comment_id: 'comment-67890',
                },
            ];

            // Test Double
            const threadId = 'thread-98765';
            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = new CommentRepository();
            const mockReplyRepository = new ReplyRepository();
            const mockLikeRepository = new LikeRepository();

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

            mockLikeRepository.getLikeByThreadId = jest.fn(() =>
                Promise.resolve(expectedLikes)
            );

            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
                replyRepository: mockReplyRepository,
                likeRepository: mockLikeRepository,
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
            expect(mockLikeRepository.getLikeByThreadId).toHaveBeenCalledWith(
                threadId
            );

            // Assert thread properties
            expect(detailThread.thread).toBeInstanceOf(ThreadDetail);
            expect(detailThread.thread.id).toBe('thread-98765');
            expect(detailThread.thread.title).toBe('title of thread');
            expect(detailThread.thread.body).toBe('some content body');
            expect(detailThread.thread.username).toBe('sampratama');

            // Assert comments
            expect(Array.isArray(detailThread.thread.comments)).toBe(true);
            expect(detailThread.thread.comments).toHaveLength(2);

            // Assert first comment
            const firstComment = detailThread.thread.comments[0];
            expect(firstComment.id).toBe('comment-12345');
            expect(firstComment.content).toBe('some content comment');
            expect(firstComment.username).toBe('rizkysamp');
            expect(firstComment.likeCount).toBe(0);
            expect(Array.isArray(firstComment.replies)).toBe(true);
            expect(firstComment.replies).toHaveLength(0);

            // Assert second comment
            const secondComment = detailThread.thread.comments[1];
            expect(secondComment.id).toBe('comment-67890');
            expect(secondComment.content).toBe('some content comment');
            expect(secondComment.username).toBe('rizkypratama');
            expect(secondComment.likeCount).toBe(1);

            // Assert replies for second comment
            expect(Array.isArray(secondComment.replies)).toBe(true);
            expect(secondComment.replies).toHaveLength(1);
            expect(secondComment.replies[0].id).toBe('reply-1998');
            expect(secondComment.replies[0].content).toBe('reply reply');
            expect(secondComment.replies[0].username).toBe('songjihyo');

            // Assert likes data
            expect(expectedLikes).toHaveLength(1);
            expect(expectedLikes[0].id).toBe('reply-1998');
            expect(expectedLikes[0].thread_id).toBe('thread-98765');
            expect(expectedLikes[0].comment_id).toBe('comment-67890');
        });
    });
});
