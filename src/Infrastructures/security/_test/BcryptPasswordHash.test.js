const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
    describe('hash function', () => {
        it('should encrypt password correctly', async () => {
            // Arrange
            const spyHash = jest.spyOn(bcrypt, 'hash');
            const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

            // Action
            const encryptedPassword = await bcryptPasswordHash.hash(
                'plain_password'
            );

            // Assert
            expect(typeof encryptedPassword).toEqual('string');
            expect(encryptedPassword).not.toEqual('plain_password');
            expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
        });
    });

    describe('comparePassword function', () => {
        it('should throw AuthenticationError if password not match', async () => {
            // Arrange
            const bcryptEncryptionHelper = new BcryptPasswordHash(bcrypt);

            // Action & Assert
            await expect(
                bcryptEncryptionHelper.comparePassword(
                    'plain_password',
                    'encrypted_password'
                )
            ).rejects.toThrow(AuthenticationError);
        });

        it('should not return AuthenticationError if password match', async () => {
            // Arrange
            const bcryptEncryptionHelper = new BcryptPasswordHash(bcrypt);
            const plainPassword = 'secret';
            const encryptedPassword = await bcryptEncryptionHelper.hash(
                plainPassword
            );

            // Act & Assert
            await expect(
                bcryptEncryptionHelper.comparePassword(
                    plainPassword,
                    encryptedPassword
                )
            ).resolves.not.toThrow(AuthenticationError);
        });
    });
});
