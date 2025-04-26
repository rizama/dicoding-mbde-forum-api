const CommentUseCase = require('../CommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('CommentUseCase class', () => {
    it('should be defined', async () => {
        const commentUseCase = new CommentUseCase({});
        expect(commentUseCase).toBeDefined();
    });

    describe('addComment function', () => {
        it('should be defined', () => {
            const commentUseCase = new CommentUseCase({});
            expect(commentUseCase.addComment).toBeDefined();
        });

        it('should orchestrating the add comment action correctly', async () => {
            const useCasePayload = {
                thread_id: 'thread-sam',
                content: 'sebuah komentar',
                user_id: 'user-sam',
            };

            const mockAddedComment = new AddedComment({
                id: 'comment-sam',
                content: useCasePayload.content,
                user_id: useCasePayload.user_id,
            });

            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = new CommentRepository();

            mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
                Promise.resolve()
            );
            mockCommentRepository.addComment = jest.fn(() =>
                Promise.resolve(mockAddedComment)
            );

            const commentUseCase = new CommentUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
            });
            const addedComment = await commentUseCase.addComment(
                useCasePayload
            );

            expect(mockThreadRepository.checkAvailabilityThread).toHaveBeenCalledWith(
                useCasePayload.thread_id
            );
            expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
                new AddComment({
                    thread_id: useCasePayload.thread_id,
                    content: useCasePayload.content,
                    user_id: useCasePayload.user_id,
                })
            );
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-sam',
                    content: useCasePayload.content,
                    user_id: useCasePayload.user_id,
                })
            );
        });
    });

    describe('deleteComment function', () => {
        it('should be defined', () => {
            const commentUseCase = new CommentUseCase({});
            expect(commentUseCase.deleteComment).toBeDefined();
        });

        it('should throw error if use case payload not contain thread_id and comment_id', async () => {
            const useCasePayload = {};
            const commentUseCase = new CommentUseCase({});

            await expect(
                commentUseCase.deleteComment(useCasePayload)
            ).rejects.toThrow(
                'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD'
            );
        });

        it('should throw error if payload not string', async () => {
            const useCasePayload = {
                thread_id: true,
                comment_id: 12345,
                user_id: 6789,
            };
            const commentUseCase = new CommentUseCase({});
            await expect(
                commentUseCase.deleteComment(useCasePayload)
            ).rejects.toThrow(
                'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
            );
        });

        it('should orchestrating the delete comment action correctly', async () => {
            const useCasePayload = {
                thread_id: 'thread-sam',
                comment_id: 'comment-sam',
                user_id: 'user-sam',
            };

            const mockCommentRepository = new CommentRepository();
            const mockThreadRepository = new ThreadRepository();

            mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
                Promise.resolve()
            );
            mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
                Promise.resolve()
            );
            mockCommentRepository.verifyCommentOwner = jest.fn(() =>
                Promise.resolve()
            );
            mockCommentRepository.deleteComment = jest.fn(() =>
                Promise.resolve()
            );

            const commentUseCase = new CommentUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
            });

            await commentUseCase.deleteComment(useCasePayload);

            expect(
                mockThreadRepository.checkAvailabilityThread
            ).toHaveBeenCalledWith(useCasePayload.thread_id);
            expect(
                mockCommentRepository.checkAvailabilityComment
            ).toHaveBeenCalledWith(useCasePayload.comment_id);
            expect(
                mockCommentRepository.verifyCommentOwner
            ).toHaveBeenCalledWith(
                useCasePayload.comment_id,
                useCasePayload.user_id
            );
            expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
                useCasePayload.comment_id
            );
        });
    });
});
