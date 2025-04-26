const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const AddUserUseCase = require('../AddUserUseCase');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

describe('AddUserUseCase', () => {
    // Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
    it('should orchestrating the add user action correctly', async () => {
        // Arrange
        const useCasePayload = {
            username: 'sam',
            password: 'rahasia',
            fullname: 'Rizky Sam Pratama',
        };

        const mockRegisteredUser = new RegisteredUser({
            id: 'user-123',
            username: useCasePayload.username,
            fullname: useCasePayload.fullname,
        });

        /** creating dependency of use case */
        const mockUserRepository = new UserRepository();
        const mockPasswordHash = new PasswordHash();

        /** mocking needed function */
        mockUserRepository.verifyAvailableUsername = jest.fn(() =>
            Promise.resolve()
        );
        mockPasswordHash.hash = jest.fn(() =>
            Promise.resolve('encrypted_password')
        );
        mockUserRepository.addUser = jest.fn(() =>
            Promise.resolve(mockRegisteredUser)
        );

        /** creating use case instance */
        const getUserUseCase = new AddUserUseCase({
            userRepository: mockUserRepository,
            passwordHash: mockPasswordHash,
        });

        // Action
        const registeredUser = await getUserUseCase.execute(useCasePayload);

        // Assert
        expect(registeredUser).toStrictEqual(
            new RegisteredUser({
                id: 'user-123',
                username: useCasePayload.username,
                fullname: useCasePayload.fullname,
            })
        );
        expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(
            useCasePayload.username
        );
        expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password);
        expect(mockUserRepository.addUser).toHaveBeenCalledWith(
            new RegisterUser({
                username: useCasePayload.username,
                password: 'encrypted_password',
                fullname: useCasePayload.fullname,
            })
        );
    });
});
