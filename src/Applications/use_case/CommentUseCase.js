const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async addComment(useCasePayload) {
        const { thread_id } = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(thread_id);
        const newComment = new AddComment(useCasePayload);
        return this._commentRepository.addComment(newComment);
    }

    async deleteComment(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { thread_id, comment_id, user_id } = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(thread_id);
        await this._commentRepository.checkAvailabilityComment(comment_id);
        await this._commentRepository.verifyCommentOwner(comment_id, user_id);
        await this._commentRepository.deleteComment(comment_id);
    }

    _validatePayload(payload) {
        const { thread_id, comment_id, user_id } = payload;

        if (!thread_id || !comment_id || !user_id) {
            throw new Error(
                'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD'
            );
        }

        if (
            typeof thread_id !== 'string' ||
            typeof comment_id !== 'string' ||
            typeof user_id !== 'string'
        ) {
            throw new Error(
                'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
            );
        }
    }
}

module.exports = CommentUseCase;
