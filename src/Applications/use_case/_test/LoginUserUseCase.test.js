const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('GetAuthenticationUseCase', () => {
    it('should orchestrating the get authentication action correctly', async () => {
        // arrange
        const useCasePayload = {
            username: 'rizkysamp',
            password: 'syalalala',
        };
        const mockedAuthentication = new NewAuth({
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
        });
        const mockUserRepository = new UserRepository();
        const mockAuthenticationRepository = new AuthenticationRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        const mockPasswordHash = new PasswordHash();

        // Mocking
        mockUserRepository.getPasswordByUsername = jest.fn(() =>
            Promise.resolve('encrypted_password')
        );
        mockPasswordHash.comparePassword = jest.fn(() => Promise.resolve());
        mockAuthenticationTokenManager.createAccessToken = jest.fn(() =>
            Promise.resolve(mockedAuthentication.accessToken)
        );
        mockAuthenticationTokenManager.createRefreshToken = jest.fn(() =>
            Promise.resolve(mockedAuthentication.refreshToken)
        );
        mockUserRepository.getIdByUsername = jest.fn(() =>
            Promise.resolve('user-123')
        );
        mockAuthenticationRepository.addToken = jest.fn(() =>
            Promise.resolve()
        );

        // create use case instance
        const loginUserUseCase = new LoginUserUseCase({
            userRepository: mockUserRepository,
            authenticationRepository: mockAuthenticationRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
            passwordHash: mockPasswordHash,
        });

        // Action
        const actualAuthentication = await loginUserUseCase.execute(
            useCasePayload
        );

        // Assert
        expect(actualAuthentication).toEqual(
            new NewAuth({
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            })
        );
        expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith(
            'rizkysamp'
        );
        expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith(
            'syalalala',
            'encrypted_password'
        );
        expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith('rizkysamp');
        expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith(
            { username: 'rizkysamp', id: 'user-123' }
        );
        expect(
            mockAuthenticationTokenManager.createRefreshToken
        ).toHaveBeenCalledWith({ username: 'rizkysamp', id: 'user-123' });
        expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(
            mockedAuthentication.refreshToken
        );
    });
});
