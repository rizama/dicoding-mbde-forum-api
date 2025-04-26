const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const replyRepository = new ReplyRepository();

        await expect(replyRepository.addReply({})).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            replyRepository.checkAvailabilityReply({})
        ).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.verifyReplyOwner({})).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(replyRepository.deleteReply({})).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(replyRepository.getReplies('')).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
    });
});
