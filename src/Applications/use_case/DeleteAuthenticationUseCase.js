class DeleteAuthenticationUseCase {
    constructor({ authenticationRepository }) {
        this._authenticationRepository = authenticationRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);
        const { refreshToken } = useCasePayload;
        await this._authenticationRepository.checkAvailableToken(refreshToken);
        await this._authenticationRepository.deleteToken(refreshToken);
    }

    _verifyPayload(payload) {
        const { refreshToken } = payload;
        if (!refreshToken)
            throw new Error(
                'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
            );

        if (typeof refreshToken !== 'string')
            throw new Error(
                'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
            );
    }
}

module.exports = DeleteAuthenticationUseCase;
