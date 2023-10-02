const NewAuth = require('../../Domains/authentications/entities/NewAuth');
const UserLogin = require('../../Domains/users/entities/UserLogin');

class LoginUserUseCase {
    constructor({
        userRepository,
        authenticationRepository,
        authenticationTokenManager,
        passwordHash,
    }) {
        this._userRepository = userRepository;
        this._authenticationRepository = authenticationRepository;
        this._authenticationTokenManager = authenticationTokenManager;
        this._passwordHash = passwordHash;
    }

    async execute(useCasePayload) {
        /** get the payload */
        const { username, password } = new UserLogin(useCasePayload);

        /** get existing encrypted password */
        const encryptedExistingPassword =
            await this._userRepository.getPasswordByUsername(username);

        /** compare password */
        await this._passwordHash.comparePassword(
            password,
            encryptedExistingPassword
        );

        /** get the id */
        const id = await this._userRepository.getIdByUsername(username);

        /** generate access token */
        const accessToken =
            await this._authenticationTokenManager.createAccessToken({
                username,
                id,
            });

        /** generate refresh token */
        const refreshToken =
            await this._authenticationTokenManager.createRefreshToken({
                username,
                id,
            });

        /** create New Auth */
        const newAuthentication = new NewAuth({
            accessToken,
            refreshToken,
        });

        /** save refresh token to database */
        await this._authenticationRepository.addToken(
            newAuthentication.refreshToken
        );

        return newAuthentication;
    }
}

module.exports = LoginUserUseCase;
