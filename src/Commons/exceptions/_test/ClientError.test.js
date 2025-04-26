const ClientError = require('../ClientError');

// Create a child class for testing
class TestClientError extends ClientError {}

describe('ClientError', () => {
    it('should throw error when directly use it', () => {
        expect(() => new ClientError('')).toThrow(
            'cannot instantiate abstract class'
        );
    });

    it('should create instance when extended by child class', () => {
        const error = new TestClientError('test message');
        expect(error).toBeInstanceOf(ClientError);
        expect(error.message).toBe('test message');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('ClientError');
    });

    it('should create instance with custom status code', () => {
        const error = new TestClientError('test message', 404);
        expect(error.statusCode).toBe(404);
    });
});
