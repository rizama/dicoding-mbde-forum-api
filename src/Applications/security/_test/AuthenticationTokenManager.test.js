const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
    it('should throw error when invoike unimplemented method', async () => {
        // Arrange
        const tokenmanager = new AuthenticationTokenManager();

        // Action & Assert
        await expect(tokenmanager.createAccessToken('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );

        await expect(tokenmanager.createRefreshToken('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );

        await expect(tokenmanager.verifyRefreshToken('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );

        await expect(tokenmanager.decodePayload('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );
    });
});
