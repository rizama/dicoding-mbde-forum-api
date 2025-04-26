const CommentRepository = require('../CommentRepository');

describe('CommentRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const commentRepository = new CommentRepository();

        await expect(commentRepository.addComment({})).rejects.toThrow(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            commentRepository.checkAvailabilityComment({})
        ).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(
            commentRepository.verifyCommentOwner({})
        ).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.deleteComment({})).rejects.toThrow(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            commentRepository.getComments('')
        ).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
