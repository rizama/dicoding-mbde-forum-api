const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            user_id: 'user-sam',
            thread: 'thread-sam',
            comment: 'comment-sam',
        };

        expect(() => new AddReply(payload)).toThrow(
            'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            user_id: 'user-sam',
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
            content: 123,
        };

        expect(() => new AddReply(payload)).toThrow(
            'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create new reply object correctly', () => {
        const payload = {
            user_id: 'user-sam',
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
            content: 'sebuah balasan',
        };

        const { user_id, thread_id, comment_id, content } = new AddReply(payload);

        expect(user_id).toEqual(payload.user_id);
        expect(thread_id).toEqual(payload.thread_id);
        expect(comment_id).toEqual(payload.comment_id);
        expect(content).toEqual(payload.content);
    });
});
