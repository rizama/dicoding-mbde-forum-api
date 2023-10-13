const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const AddLike = require('../../../Domains/likes/entities/AddLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('LikeRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    const addThreadPayload = {
        id: 'thread-sam',
        user_id: 'user-sam',
    };

    const addCommentPayload = {
        id: 'comment-sam',
        thread_id: 'thread-sam',
        user_id: 'user-sam',
    };

    const addLikePayload = {
        id: 'like-sam',
        thread_id: 'thread-sam',
        comment_id: 'comment-sam',
        user_id: 'user-sam',
    };

    describe('addLike function', () => {
        it('should persist register like and return registered like correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-sam' });
            await ThreadsTableTestHelper.addThread(addThreadPayload);
            await CommentsTableTestHelper.addComment(addCommentPayload);
            const addLike = new AddLike({
                thread_id: 'thread-sam',
                comment_id: 'comment-sam',
                user_id: 'user-sam',
            });
            const fakeIdGenerator = () => 'sam';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedLike = await likeRepositoryPostgres.addLike(addLike);
            expect(addedLike).toStrictEqual('like-sam');
            const likes = await LikesTableTestHelper.findLikeById('like-sam');
            expect(likes).toHaveLength(1);
        });
    });

    describe('verifyAvailableLike function', () => {
        it('should throw null when thread, comment, and user not available', async () => {
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            await expect(
                likeRepositoryPostgres.verifyAvailableLike(
                    'thread-sam',
                    'comment-sam',
                    'user-sam'
                )
            ).resolves.toStrictEqual(null);
        });

        it('should throw id when thread, comment, and user available', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-sam' });
            await ThreadsTableTestHelper.addThread(addThreadPayload);
            await CommentsTableTestHelper.addComment(addCommentPayload);
            await LikesTableTestHelper.addLike(addLikePayload);
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            await expect(
                likeRepositoryPostgres.verifyAvailableLike(
                    'thread-sam',
                    'comment-sam',
                    'user-sam'
                )
            ).resolves.toStrictEqual('like-sam');
        });
    });

    describe('deleteLike function', () => {
        it('should throw Error when something wrong', async () => {
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            await expect(
                likeRepositoryPostgres.deleteLike('like-sam')
            ).rejects.toThrowError(InvariantError);
        });

        it('should not throw Error when query run correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-sam' });
            await ThreadsTableTestHelper.addThread(addThreadPayload);
            await CommentsTableTestHelper.addComment(addCommentPayload);
            await LikesTableTestHelper.addLike(addLikePayload);
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            await expect(
                likeRepositoryPostgres.deleteLike('like-sam')
            ).resolves.not.toThrowError(InvariantError);
        });
    });

    describe('getLikeByThreadId function', () => {
        it('should throw 0 when like in comment not available', async () => {
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-sam');

            expect(likes).toHaveLength(0);
        });

        it('should return like count when like in comment available', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-sam' });
            await ThreadsTableTestHelper.addThread(addThreadPayload);
            await CommentsTableTestHelper.addComment(addCommentPayload);
            await LikesTableTestHelper.addLike(addLikePayload);
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            const likes = await likeRepositoryPostgres.getLikeByThreadId('thread-sam');

            expect(Array.isArray(likes)).toBe(true);
            expect(likes[0].id).toEqual('like-sam');
            expect(likes[0].thread_id).toEqual('thread-sam');
            expect(likes[0].comment_id).toEqual('comment-sam');
        });
    });
});
