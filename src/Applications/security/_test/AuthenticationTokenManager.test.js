const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
    it('should throw error when invoike unimplemented method', async () => {
        // Arrange
        const tokenmanager = new AuthenticationTokenManager();

        // Action & Assert
        await expect(tokenmanager.createAccessToken('')).rejects.toThrow(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );

        await expect(tokenmanager.createRefreshToken('')).rejects.toThrow(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );

        await expect(tokenmanager.verifyRefreshToken('')).rejects.toThrow(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );

        await expect(tokenmanager.decodePayload('')).rejects.toThrow(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
        );
    });
});
