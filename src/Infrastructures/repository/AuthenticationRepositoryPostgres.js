const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
    constructor(pool) {
        super();
        this._pool = pool;
    }

    async addToken(token) {
        const query = {
            text: 'INSERT INTO authentications VALUES ($1)',
            values: [token],
        };

        await this._pool.query(query);
    }

    async checkAvailableToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError(
                'refresh token tidak ditemukan di database'
            );
        }
    }

    async deleteToken(token) {
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthenticationRepositoryPostgres;
