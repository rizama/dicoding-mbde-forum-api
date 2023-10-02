const AddReply = require('../../Domains/replies/entities/AddReply');

class ReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async addReply(useCasePayload) {
        const { thread_id, comment_id } = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(thread_id);
        await this._commentRepository.checkAvailabilityComment(comment_id);
        const newReply = new AddReply(useCasePayload);
        return this._replyRepository.addReply(newReply);
    }

    async deleteReply(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { thread_id, comment_id, reply_id, user_id } = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(thread_id);
        await this._commentRepository.checkAvailabilityComment(comment_id);
        await this._replyRepository.checkAvailabilityReply(reply_id);
        await this._replyRepository.verifyReplyOwner(reply_id, user_id);
        await this._replyRepository.deleteReply(reply_id);
    }

    _validatePayload(payload) {
        const { thread_id, comment_id, reply_id, user_id } = payload;

        if (!thread_id || !comment_id || !reply_id || !user_id) {
            throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
        }

        if (
            typeof thread_id !== 'string' ||
            typeof comment_id !== 'string' ||
            typeof reply_id !== 'string' ||
            typeof user_id !== 'string'
        ) {
            throw new Error(
                'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
            );
        }
    }
}

module.exports = ReplyUseCase;
