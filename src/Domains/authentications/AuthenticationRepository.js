/* eslint-disable no-unused-vars */
// Interface AuthenticationRepository
class AuthenticationRepository {
    async addToken(token) {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async checkAvailableToken(token) {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteToken(token) {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = AuthenticationRepository;
