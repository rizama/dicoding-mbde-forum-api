const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const replyRepository = new ReplyRepository();

        await expect(replyRepository.addReply({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            replyRepository.checkAvailabilityReply({})
        ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.verifyReplyOwner({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(replyRepository.deleteReply({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(replyRepository.getReplies('')).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
    });
});
