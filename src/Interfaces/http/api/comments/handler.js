const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const { id: user_id } = request.auth.credentials;
        const thread_id = request.params.threadId;
        const useCasePayload = {
            content: request.payload.content,
            thread_id,
            user_id,
        };
        const result = await commentUseCase.addComment(useCasePayload);
        const addedComment = {
            id: result.id,
            content: result.content,
            owner: result.user_id
        }

        return h
            .response({
                status: 'success',
                data: {
                    addedComment,
                },
            })
            .code(201);
    }

    async deleteCommentHandler(request, h) {
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const { id: user_id } = request.auth.credentials;
        const thread_id = request.params.threadId;
        const comment_id = request.params.id;
        const useCasePayload = {
            thread_id,
            comment_id,
            user_id,
        };
        await commentUseCase.deleteComment(useCasePayload);

        return h.response({
            status: 'success',
        });
    }
}

module.exports = CommentHandler;
