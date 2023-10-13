const AddLike = require('../../../Domains/likes/entities/AddLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
    it('should orchestrating the add like action correctly', async () => {
        const useCasePayload = {
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
            user_id: 'user-sam',
        };
        const expectedRegisteredLike = new AddLike({
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
            user_id: 'user-sam',
        });
        const mockLikeRepository = new LikeRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockLikeRepository.verifyAvailableLike = jest.fn(() =>
            Promise.resolve(null)
        );
        mockLikeRepository.addLike = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
            Promise.resolve()
        );
        mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
            Promise.resolve()
        );

        const getLikeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });
        await getLikeUseCase.execute(useCasePayload);

        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
            useCasePayload.thread_id
        );
        expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
            useCasePayload.comment_id
        );
        expect(mockLikeRepository.verifyAvailableLike).toBeCalledWith(
            'thread-sam',
            'comment-sam',
            'user-sam'
        );
        expect(mockLikeRepository.addLike).toBeCalledWith(
            expectedRegisteredLike
        );
    });

    it('should orchestrating the delete like action correctly', async () => {
        const useCasePayload = {
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
            user_id: 'user-sam',
        };
        const mockLikeRepository = new LikeRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockLikeRepository.verifyAvailableLike = jest.fn(() =>
            Promise.resolve('like-sam')
        );
        mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn(() =>
            Promise.resolve()
        );
        mockThreadRepository.checkAvailabilityThread = jest.fn(() =>
            Promise.resolve()
        );

        const getLikeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });
        await getLikeUseCase.execute(useCasePayload);

        expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(
            useCasePayload.thread_id
        );
        expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
            useCasePayload.comment_id
        );
        expect(mockLikeRepository.verifyAvailableLike).toBeCalledWith(
            'thread-sam',
            'comment-sam',
            'user-sam'
        );
        expect(mockLikeRepository.deleteLike).toBeCalledWith('like-sam');
    });
});
