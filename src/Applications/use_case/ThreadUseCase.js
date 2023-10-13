const AddThread = require('../../Domains/threads/entities/AddThread');
const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReplies = require('../../Domains/replies/entities/GetReplies');

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
        // code
        const threadId = useCasePayload;
        await this._threadRepository.checkAvailabilityThread(threadId);

        const thread = await this._threadRepository.getThread(threadId);

        const comments = await this._commentRepository.getComments(
            threadId
        );
        const commentsThread = comments.map((comment) => {
            return {
                ...comment,
                date: new Date(comment.date).toISOString(),
            };
        });

        const replies = await this._replyRepository.getReplies(threadId);
        const repliesThread = replies.map((reply) => {
            return {
                ...reply,
                date: new Date(reply.date).toISOString(),
            };
        });

        const likes = await this._likeRepository.getLikeByThreadId(threadId);

        // merging
        const commentsWithReplies = commentsThread
            .filter((comment) => comment.thread_id === threadId)
            .map((comment) => {
                const replies = repliesThread
                    .filter((reply) => reply.comment_id === comment.id)
                    .map((reply) => {
                        const buildGetReplies = new GetReplies({
                            replies: [reply],
                        }).replies[0];
                        return buildGetReplies;
                    });

                const buildGetComment = new GetComment({ comments: [comment] })
                    .comments[0];

                const likesCount = likes.filter(like => like.comment_id === comment.id).length;
                return {
                    ...buildGetComment,
                    replies,
                    likeCount: likesCount,
                };
            });

        return {
            thread: {
                ...thread,
                comments: commentsWithReplies,
            },
        };
    }
}

module.exports = ThreadUseCase;
