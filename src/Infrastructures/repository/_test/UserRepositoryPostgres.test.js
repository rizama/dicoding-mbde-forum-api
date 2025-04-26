const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('verifyAvailableUsername function', () => {
        it('should throw InvariantError when username not available', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ username: 'sam' }); // memasukan user baru dengan username sam
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(
                userRepositoryPostgres.verifyAvailableUsername('sam')
            ).rejects.toThrow(InvariantError);
        });

        it('should not throw InvariantError when username available', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(
                userRepositoryPostgres.verifyAvailableUsername('sam')
            ).resolves.not.toThrow(InvariantError);
        });
    });

    describe('addUser function', () => {
        it('should persist register user', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'sam',
                password: 'samtampan',
                fullname: 'Rizky Sam Pratama',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new UserRepositoryPostgres(
                pool,
                fakeIdGenerator
            ); // instance of impl User Repository Concret

            // Action
            await userRepositoryPostgres.addUser(registerUser); // insert user

            // Assert
            const users = await UsersTableTestHelper.findUsersById('user-123'); // check user to db
            expect(users).toHaveLength(1); // make sure its stored
        });

        it('should return registered user correctly', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new UserRepositoryPostgres(
                pool,
                fakeIdGenerator
            ); // instance of impl User Repository Concret

            // Action
            const registeredUser = await userRepositoryPostgres.addUser(
                registerUser
            ); // insert user

            // Assert
            expect(registeredUser).toStrictEqual(
                new RegisteredUser({
                    id: 'user-123',
                    username: 'dicoding',
                    fullname: 'Dicoding Indonesia',
                })
            ); // make sure return structure is correct
        });
    });

    describe('getPasswordByUsername', () => {
        it('should throw InvariantError when user not found', () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action & Assert
            return expect(
                userRepositoryPostgres.getPasswordByUsername('dicoding')
            ).rejects.toThrow(InvariantError);
        });

        it('should return username password when user is found', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
            await UsersTableTestHelper.addUser({
                username: 'dicoding',
                password: 'secret_password',
            });

            // Action & Assert
            const password = await userRepositoryPostgres.getPasswordByUsername(
                'dicoding'
            );
            expect(password).toBe('secret_password');
        });
    });

    describe('getIdByUsername', () => {
        it('should throw InvariantError when user not found', async () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(
                userRepositoryPostgres.getIdByUsername('dicoding')
            ).rejects.toThrow(InvariantError);
        });

        it('should return user id correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-321',
                username: 'dicoding',
            });
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action
            const userId = await userRepositoryPostgres.getIdByUsername(
                'dicoding'
            );

            // Assert
            expect(userId).toEqual('user-321');
        });
    });
});
