const AddThread = require('../../Domains/threads/entities/AddThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadUseCase {
    constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeRepository = likeRepository;
    }

    async addThread(useCasePayload) {
        const newThread = new AddThread(useCasePayload);
        return this._threadRepository.addThread(newThread);
    }

    async getThread(useCasePayload) {
        const threadId = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(threadId);

        const thread = await this._threadRepository.getThread(threadId);
        const comments = await this._commentRepository.getComments(threadId);
        const replies = await this._replyRepository.getReplies(threadId);
        const likes = await this._likeRepository.getLikeByThreadId(threadId);

        const threadDetail = new ThreadDetail({
            thread,
            comments,
            replies,
            likes,
        });

        return {
            thread: threadDetail,
        };
    }
}

module.exports = ThreadUseCase;
