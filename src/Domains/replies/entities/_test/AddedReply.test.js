const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'reply-sam',
            user_id: 'user-sam',
        };

        expect(() => new AddedReply(payload)).toThrowError(
            'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'reply-sam',
            content: 123,
            user_id: 'user-sam',
        };

        expect(() => new AddedReply(payload)).toThrowError(
            'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create new added reply object correctly', () => {
        const payload = {
            id: 'reply-sam',
            content: 'i like running man',
            user_id: 'user-sam',
        };

        const addedReply = new AddedReply(payload);

        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.user_id).toEqual(payload.user_id);
    });
});
