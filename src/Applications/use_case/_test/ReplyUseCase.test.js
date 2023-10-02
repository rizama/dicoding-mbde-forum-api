const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyUseCase = require('../ReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
// const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ReplyUseCase class', () => {
    it('should be defined', async () => {
        const replyUseCase = new ReplyUseCase({});
        expect(replyUseCase).toBeDefined();
    });

    describe('addReply function', () => {
        it('should be defined', () => {
            const replyUseCase = new ReplyUseCase({});
            expect(replyUseCase.addReply).toBeDefined();
        });

        it('should orchestrating the add reply action correctly', async () => {
            const useCasePayload = {
                thread_id: 'thread-sam',
                comment_id: 'comment-sam',
                content: 'some comment',
                user_id: 'user-sam',
            };

            const mockAddedReply = new AddedReply({
                id: 'reply-sam',
                content: useCasePayload.content,
                user_id: useCasePayload.user_id,
            });

            const mockThreadRepository = new ThreadRepository();
            const mockCommentRepository = {
                checkAvailabilityComment() {},
            };
            const mockReplyRepository = new ReplyRepository();

            mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
                Promise.resolve()
            );
            mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
                Promise.resolve()
            );
            mockReplyRepository.addReply = jest.fn(() =>
                Promise.resolve(mockAddedReply)
            );

            const replyUseCase = new ReplyUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
                replyRepository: mockReplyRepository,
            });
            const addedReply = await replyUseCase.addReply(useCasePayload);

            expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
                useCasePayload.thread_id
            );
            expect(
                mockCommentRepository.checkAvailabilityComment
            ).toBeCalledWith(useCasePayload.comment_id);
            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: 'reply-sam',
                    content: useCasePayload.content,
                    user_id: useCasePayload.user_id,
                })
            );
            expect(mockReplyRepository.addReply).toBeCalledWith(
                new AddReply({
                    thread_id: useCasePayload.thread_id,
                    comment_id: useCasePayload.comment_id,
                    content: useCasePayload.content,
                    user_id: useCasePayload.user_id,
                })
            );
        });
    });

    describe('deleteReply function', () => {
        it('should be defined', () => {
            const replyUseCase = new ReplyUseCase({}, {}, {});
            expect(replyUseCase.deleteReply).toBeDefined();
        });

        it('should throw error if use case payload not contain thread_id and comment_id', async () => {
            const useCasePayload = {};
            const replyUseCase = new ReplyUseCase({});

            await expect(
                replyUseCase.deleteReply(useCasePayload)
            ).rejects.toThrowError(
                'DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD'
            );
        });

        it('should throw error if payload not string', async () => {
            const useCasePayload = {
                thread_id: 123,
                comment_id: 456,
                reply_id: 789,
                user_id: 11234,
            };
            const replyUseCase = new ReplyUseCase({});
            await expect(
                replyUseCase.deleteReply(useCasePayload)
            ).rejects.toThrowError(
                'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
            );
        });

        it('should orchestrating the delete reply action correctly', async () => {
            const useCasePayload = {
                thread_id: 'thread-sam',
                comment_id: 'comment-sam',
                reply_id: 'reply-sam',
                user_id: 'user-sam',
            };

            const mockReplyRepository = new ReplyRepository();
            const mockCommentRepository = {
                checkAvailabilityComment() {},
            };
            const mockThreadRepository = new ThreadRepository();

            mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
                Promise.resolve()
            );
            mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
                Promise.resolve()
            );
            mockReplyRepository.checkAvailabilityReply = jest.fn(() =>
                Promise.resolve()
            );
            mockReplyRepository.verifyReplyOwner = jest.fn(() =>
                Promise.resolve()
            );
            mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

            const replyUseCase = new ReplyUseCase({
                threadRepository: mockThreadRepository,
                commentRepository: mockCommentRepository,
                replyRepository: mockReplyRepository,
            });

            await replyUseCase.deleteReply(useCasePayload);

            expect(
                mockThreadRepository.checkAvailabilityThread
            ).toHaveBeenCalledWith(useCasePayload.thread_id);
            expect(
                mockCommentRepository.checkAvailabilityComment
            ).toHaveBeenCalledWith(useCasePayload.comment_id);
            expect(
                mockReplyRepository.checkAvailabilityReply
            ).toHaveBeenCalledWith(useCasePayload.reply_id);
            expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
                useCasePayload.reply_id,
                useCasePayload.user_id
            );
            expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(
                useCasePayload.reply_id
            );
        });
    });
});
