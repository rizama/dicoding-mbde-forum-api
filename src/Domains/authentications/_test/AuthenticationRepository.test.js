const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        // Arrange
        const authenticationRepository = new AuthenticationRepository();

        // Action & Assert
        await expect(
            authenticationRepository.addToken('')
        ).rejects.toThrow(
            'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            authenticationRepository.checkAvailableToken('')
        ).rejects.toThrow(
            'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(
            authenticationRepository.deleteToken('')
        ).rejects.toThrow(
            'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
    });
});
