const AddThread = require('../AddThread');

describe('AddThread entity', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'some title',
            body: 'some content',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrow(
            'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 'some title',
            body: 900000,
            user_id: 'user-sksds',
        };

        // Action & Assert
        expect(() => new AddThread(payload)).toThrow(
            'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should throw error when title contains more than 50 character', () => {
        // Arrange
        const payload = {
            title: 'Lorem, ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat dignissim odio eu ullamcorper. Suspendisse pharetra, urna eget auctor bibendum, turpis dolor rutrum arcu, quis cursus nunc diam vel leo. Sed a nisl felis. Sed condimentum elit eget metus molestie sollicitudin. Aenean in lorem lectus. Suspendisse volutpat turpis tortor, eu.',
            body: 'this is content of thread',
            user_id: 'user-sksds',
        };
        // Action and Assert
        expect(() => new AddThread(payload)).toThrow(
            'ADD_THREAD.TITLE_LIMIT_CHAR'
        );
    });

    it('should create new thread object correctly', () => {
        // Arrange
        const payload = {
            title: 'some title',
            body: 'some content of thread',
            user_id: 'user-asdasdasd',
        };

        // Action
        const { title, body, user_id } = new AddThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(user_id).toEqual(payload.user_id);
    });
});
