const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        this.putLikeHandler = this.putLikeHandler.bind(this);
    }

    async putLikeHandler(request, h) {
        const { threadId: thread_id, commentId: comment_id } = request.params;
        const { id: user_id } = request.auth.credentials;

        const payload = {
            thread_id,
            comment_id,
            user_id,
        };
        const likeUseCase = this._container.getInstance(LikeUseCase.name);
        await likeUseCase.execute(payload);

        return h.response({
          status: 'success',
        });
    }
}

module.exports = RepliesHandler;
