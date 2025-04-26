const AddedThread = require('../AddedThread');

describe('AddedThread entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'thread-sdlakdja',
            user_id: 'user-123',
        };

        expect(() => new AddedThread(payload)).toThrow(
            'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'thread-sdlakdja',
            title: 'some title',
            user_id: 123456,
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrow(
            'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create added thread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-sdlakdja',
            title: 'some title',
            user_id: 'user-213rkf',
        };

        // Action
        const addedThread = new AddedThread(payload);

        // Assert
        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.user_id).toEqual(payload.user_id);
    });
});
