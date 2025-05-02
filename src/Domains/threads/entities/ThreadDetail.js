const GetComment = require('../../comments/entities/GetComment');
const GetReplies = require('../../replies/entities/GetReplies');

class ThreadDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { thread, comments, replies, likes } = payload;

        this.id = thread.id;
        this.title = thread.title;
        this.body = thread.body;
        this.date = thread.date;
        this.username = thread.username;

        const _transformComments = new GetComment({ comments });
        const _transformReplies = new GetReplies({ replies });
        this.comments = this._buildComments(_transformComments.comments, _transformReplies.replies, likes);
    }

    _verifyPayload(payload) {
        const { thread, comments, replies, likes } = payload;

        if (!thread || !comments || !replies || !likes) {
            throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (!Array.isArray(comments) || !Array.isArray(replies) || !Array.isArray(likes)) {
            throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    _buildComments(comments, replies, likes) {
        return comments.map((comment) => {
            const commentReplies = replies
                .filter((reply) => reply.comment_id === comment.id)
                .map((reply) => ({
                    id: reply.id,
                    content: reply.content,
                    date: reply.date,
                    username: reply.username,
                }));

            const likesCount = likes.filter(like => like.comment_id === comment.id).length;

            return {
                id: comment.id,
                content: comment.content,
                date: comment.date,
                username: comment.username,
                replies: commentReplies,
                likeCount: likesCount,
            };
        });
    }
}

module.exports = ThreadDetail; 