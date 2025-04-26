const AddLike = require('../AddLike');

describe('a AddLike entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
        };
        expect(() => new AddLike(payload)).toThrow(
            'REGISTER_LIKE.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            thread_id: 1234,
            comment_id: [],
            user_id: 'user-sam',
        };
        expect(() => new AddLike(payload)).toThrow(
            'REGISTER_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create AddLike object correctly', () => {
        const payload = {
            thread_id: 'thread-sam',
            comment_id: 'comment-sam',
            user_id: 'user-sam',
        };
        const { thread_id, comment_id, user_id } = new AddLike(payload);
        expect(thread_id).toEqual('thread-sam');
        expect(comment_id).toEqual('comment-sam');
        expect(user_id).toEqual('user-sam');
    });
});
