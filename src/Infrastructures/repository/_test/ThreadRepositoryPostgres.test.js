const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    it('should be instance of ThreadRepository', () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist new thread and return added thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-rizkysamp',
                username: 'rizkysamp',
            });

            const newThread = new AddThread({
                title: 'some thread',
                body: 'some body thread',
                user_id: 'user-rizkysamp',
            });

            const fakeIdGenerator = () => '12345';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(
                newThread
            );

            // Assert
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: 'thread-12345',
                    title: 'some thread',
                    user_id: 'user-rizkysamp',
                })
            );

            const thread = await ThreadsTableTestHelper.findThreadsById(
                'thread-12345'
            );
            expect(thread).toHaveLength(1);
        });
    });

    describe('checkAvailabilityThread function', () => {
        it('should throw NotFoundError if thread not available', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            );

            const threadId = 'thread-sksd';

            await expect(
                threadRepositoryPostgres.checkAvailabilityThread(threadId)
            ).rejects.toThrow(NotFoundError);
            await expect(
                threadRepositoryPostgres.checkAvailabilityThread(threadId)
            ).rejects.toThrowError('thread tidak ditemukan!');
        });

        it('should not throw NotFoundError if thread available', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            );

            await UsersTableTestHelper.addUser({
                id: 'user-samsam',
                username: 'dicoding',
            });
            await ThreadsTableTestHelper.addThread({
                id: 'thread-asldkjas',
                body: 'some body thread',
                user_id: 'user-samsam',
            });

            await expect(
                threadRepositoryPostgres.checkAvailabilityThread(
                    'thread-asldkjas'
                )
            ).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('getDetailThread function', () => {
        it('should get detail thread', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {}
            );

            const userPayload = {
                id: 'user-123',
                username: 'dicoding123',
            };

            await UsersTableTestHelper.addUser(userPayload);

            const threadPayload = {
                id: 'thread-123',
                title: 'sebuah thread',
                body: 'sebuah body thread',
                user_id: 'user-123',
            };

            await ThreadsTableTestHelper.addThread(threadPayload);

            const detailThread = await threadRepositoryPostgres.getThread(
                threadPayload.id
            );

            expect(detailThread.id).toEqual(threadPayload.id);
            expect(detailThread.title).toEqual(threadPayload.title);
            expect(detailThread.body).toEqual(threadPayload.body);
            expect(detailThread.username).toEqual(userPayload.username);
        });
    });
});
