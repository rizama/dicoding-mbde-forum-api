const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
    it('should be defeinded and instance of CommentRepository domain', () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {});

        expect(commentRepositoryPostgres).toBeDefined();
        expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    const addUserPayload = {
        id: 'user-sam',
        username: 'rizkysamp',
    };

    const addThreadPayload = {
        id: 'thread-sam',
        body: 'some body thread',
        user_id: 'user-sam',
    };

    const addCommentPayload = {
        content: 'some comment netizen',
        thread_id: 'thread-sam',
        user_id: 'user-sam',
    };

    describe('addComment function', () => {
        it('should persist new comment and return added comment correctly', async () => {
            await UsersTableTestHelper.addUser(addUserPayload);

            await ThreadsTableTestHelper.addThread(addThreadPayload);

            const newComment = new AddComment(addCommentPayload);

            const fakeIdGenerator = () => 'sam';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedComment = await commentRepositoryPostgres.addComment(
                newComment
            );
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-sam',
                    content: 'some comment netizen',
                    user_id: 'user-sam',
                })
            );

            const comment = await CommentsTableTestHelper.findCommentsById(
                'comment-sam'
            );
            expect(comment).toHaveLength(1);
        });
    });

    describe('checkAvailabilityComment function', () => {
        it('should throw NotFoundError if comment not available', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );
            const commentId = 'sam';

            await expect(
                commentRepositoryPostgres.checkAvailabilityComment(commentId)
            ).rejects.toThrow(NotFoundError);
        });

        it('should not throw NotFoundError if comment available', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );
            await UsersTableTestHelper.addUser(addUserPayload);

            await ThreadsTableTestHelper.addThread(addThreadPayload);

            await CommentsTableTestHelper.addComment(addCommentPayload);

            await expect(
                commentRepositoryPostgres.checkAvailabilityComment(
                    'comment-sam'
                )
            ).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw AuthorizationError if comment not belong to owner', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );
            await UsersTableTestHelper.addUser(addUserPayload);

            await UsersTableTestHelper.addUser({
                id: 'user-samsam',
                username: 'pratama',
            });

            await ThreadsTableTestHelper.addThread(addThreadPayload);

            await CommentsTableTestHelper.addComment(addCommentPayload);
            const userId = 'user-samsam';

            await expect(
                commentRepositoryPostgres.verifyCommentOwner(
                    'comment-sam',
                    userId
                )
            ).rejects.toThrow(AuthorizationError);
        });

        it('should not throw AuthorizationError if comment is belongs to owner', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );
            await UsersTableTestHelper.addUser(addUserPayload);

            await ThreadsTableTestHelper.addThread(addThreadPayload);

            await CommentsTableTestHelper.addComment(addCommentPayload);

            await expect(
                commentRepositoryPostgres.verifyCommentOwner(
                    'comment-sam',
                    'user-sam'
                )
            ).resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('deleteComment function', () => {
        it('should delete comment from database', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );
            await UsersTableTestHelper.addUser(addUserPayload);

            await ThreadsTableTestHelper.addThread(addThreadPayload);

            await CommentsTableTestHelper.addComment(addCommentPayload);

            await commentRepositoryPostgres.deleteComment('comment-sam');

            const comment =
                await CommentsTableTestHelper.checkdeletedAtCommentsById(
                    'comment-sam'
                );

            expect(typeof comment).toEqual('boolean');
        });
    });

    describe('getComments function', () => {
        it('should get comments of thread', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {}
            );

            await UsersTableTestHelper.addUser(addUserPayload);
            await ThreadsTableTestHelper.addThread(addThreadPayload);
            await CommentsTableTestHelper.addComment(addCommentPayload);

            const comments = await commentRepositoryPostgres.getComments(
                addThreadPayload.id
            );

            expect(Array.isArray(comments)).toBe(true);
            expect(comments[0].id).toEqual('comment-sam');
            expect(comments[0].thread_id).toEqual('thread-sam');
            expect(comments[0].username).toEqual('rizkysamp');
            expect(comments[0].content).toEqual('some comment netizen');
            expect(comments[0].is_delete).toBeDefined();
            expect(comments[0].date).toBeDefined();
        });
    });
});
