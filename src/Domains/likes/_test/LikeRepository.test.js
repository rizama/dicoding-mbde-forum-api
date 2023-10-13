const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const replyRepository = new LikeRepository();
        await expect(replyRepository.addLike({})).rejects.toThrowError(
            'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            replyRepository.verifyAvailableLike('', '', '')
        ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.deleteLike('')).rejects.toThrowError(
            'LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            replyRepository.getLikeByThreadId('')
        ).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
