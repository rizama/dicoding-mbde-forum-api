const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');

describe('DeleteAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        // Arrange
        const useCasePayload = {};
        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({}); // stub

        // Action & Assert
        await expect(
            deleteAuthenticationUseCase.execute(useCasePayload)
        ).rejects.toThrow(
            'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
        );
    });

    it('should throw error if refresh token not string', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 123,
        };
        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

        // Action & Assert
        await expect(
            deleteAuthenticationUseCase.execute(useCasePayload)
        ).rejects.toThrow(
            'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should orchestrating the delete authentication action correctly', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 'refreshToken',
        };

        // Mocking
        const mockAuthenticationRepository = new AuthenticationRepository();
        mockAuthenticationRepository.checkAvailableToken = jest.fn(() => Promise.resolve());
        mockAuthenticationRepository.deleteToken = jest.fn(() => Promise.resolve());

        // Create use case instance
        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
            authenticationRepository: mockAuthenticationRepository,
        });

        // Action
        await deleteAuthenticationUseCase.execute(useCasePayload);

        // Assert
        expect(
            mockAuthenticationRepository.checkAvailableToken
        ).toHaveBeenCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
            useCasePayload.refreshToken
        );
    });
});
