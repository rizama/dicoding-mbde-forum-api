const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interfaces', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const threadRepository = new ThreadRepository();

        // Action and Assert
        await expect(threadRepository.addThread({})).rejects.toThrow(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );

        await expect(
            threadRepository.checkAvailabilityThread({})
        ).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadRepository.getThread({})).rejects.toThrow(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
    });
});
