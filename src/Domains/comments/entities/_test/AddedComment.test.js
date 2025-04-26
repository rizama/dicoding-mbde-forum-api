const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'comment-sam',
            user_id: 'user-sam',
        };

        expect(() => new AddedComment(payload)).toThrow(
            'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'comment-sam',
            content: 123,
            user_id: 'user-sam',
        };

        expect(() => new AddedComment(payload)).toThrow(
            'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create new added comment object correctly', () => {
        const payload = {
            id: 'comment-sam',
            content: 'sebuah comment',
            user_id: 'user-sam',
        };

        const addedComment = new AddedComment(payload);

        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.user_id).toEqual(payload.user_id);
    });
});
