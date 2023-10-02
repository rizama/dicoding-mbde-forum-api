const CommentRepository = require('../CommentRepository');

describe('CommentRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const commentRepository = new CommentRepository();

        await expect(commentRepository.addComment({})).rejects.toThrowError(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            commentRepository.checkAvailabilityComment({})
        ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(
            commentRepository.verifyCommentOwner({})
        ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.deleteComment({})).rejects.toThrowError(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            commentRepository.getComments('')
        ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
