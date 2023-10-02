const GetThread = require('../GetThread');

describe('GetThread entity', () => {
    it('should throw an error when did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'Some Thread Title',
            body: 'Lorem Ipsum Dolor',
            date: '2023-09-21',
            username: 'rizkysamp',
        };

        // Action & Assert
        expect(() => new GetThread(payload)).toThrowError(
            'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
        );
    });

    it('should throw an error when did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 2324938439,
            title: 'Some Thread Title',
            body: 'Lorem Ipsum Dolor',
            date: '2023-09-21',
            username: 'rizkysamp',
        };

        // Action & Assert
        expect(() => new GetThread(payload)).toThrowError(
            'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should return GetThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-ksdjlskdjslk',
            title: 'Some Thread Title',
            body: 'Lorem Ipsum Dolor',
            date: '2023-09-21',
            username: 'rizkysamp',
        };

        // Action
        const getThread = new GetThread(payload);

        // Assert
        expect(getThread.id).toEqual(payload.id);
        expect(getThread.title).toEqual(payload.title);
        expect(getThread.body).toEqual(payload.body);
        expect(getThread.date).toEqual(new Date(payload.date).toISOString());
        expect(getThread.username).toEqual(payload.username);
    });
});
