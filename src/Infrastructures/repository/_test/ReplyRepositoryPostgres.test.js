const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
    it('should be instance of ReplyRepository domain', () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

        expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    const getPayloadDummy = () => {
        const userPayload = {
            id: 'user-sam',
            username: 'rizkysamp',
        };

        const threadPayload = {
            id: 'thread-123',
            title: 'threaddddddd',
            body: 'body thread',
            user_id: userPayload.id,
        };

        const commentPayload = {
            id: 'comment-sam',
            content: 'komentar netijen',
            thread_id: threadPayload.id,
            user_id: userPayload.id,
        };

        const replyPayload = {
            id: 'reply-sam',
            thread_id: threadPayload.id,
            comment_id: commentPayload.id,
            content: 'reply from stranger',
            user_id: userPayload.id,
        };

        return {
            userPayload,
            threadPayload,
            commentPayload,
            replyPayload,
        };
    };

    describe('addReply function', () => {
        it('should persist new reply and return added reply correctly', async () => {
            const fakeIdGenerator = () => 'sam';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const { userPayload, threadPayload, commentPayload, replyPayload } =
                getPayloadDummy();

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);

            const replyData = new AddReply({
                thread_id: threadPayload.id,
                comment_id: commentPayload.id,
                content: replyPayload.content,
                user_id: userPayload.id,
            });

            const addedReply = await replyRepositoryPostgres.addReply(
                replyData
            );

            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: replyPayload.id,
                    content: replyPayload.content,
                    user_id: userPayload.id,
                })
            );

            const reply = await RepliesTableTestHelper.findRepliesById(
                'reply-sam'
            );

            expect(reply).toHaveLength(1);
            expect(reply).toEqual(expect.any(Array));
            expect(reply[0]).toEqual(expect.any(Object));
            expect(reply[0]).toHaveProperty('id', expect.any(String));
        });
    });

    describe('checkAvailabilityReply function', () => {
        it('should throw NotFoundError if reply not available', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );
            const reply = 'reply-sam';

            await expect(
                replyRepositoryPostgres.checkAvailabilityReply(reply)
            ).rejects.toThrow(NotFoundError);
        });

        it('should not throw NotFoundError if reply available', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );

            const { userPayload, threadPayload, commentPayload, replyPayload } =
                getPayloadDummy();

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);
            await RepliesTableTestHelper.addReply(replyPayload);

            await expect(
                replyRepositoryPostgres.checkAvailabilityReply('reply-sam')
            ).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('verifyReplyOwner function', () => {
        it('should throw AuthorizationError if reply not belong to owner', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );

            const { userPayload, threadPayload, commentPayload, replyPayload } =
                getPayloadDummy();

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);
            await RepliesTableTestHelper.addReply(replyPayload);

            await UsersTableTestHelper.addUser({
                id: 'user-samsam',
                username: 'dicoding_samsam',
            });
            const user_id = 'user-samsam';

            await expect(
                replyRepositoryPostgres.verifyReplyOwner('reply-sam', user_id)
            ).rejects.toThrow(AuthorizationError);
        });

        it('should not throw AuthorizationError if reply is belongs to owner', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );

            const { userPayload, threadPayload, commentPayload, replyPayload } =
                getPayloadDummy();

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);
            await RepliesTableTestHelper.addReply(replyPayload);

            await expect(
                replyRepositoryPostgres.verifyReplyOwner(
                    'reply-sam',
                    'user-sam'
                )
            ).resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('deleteReply', () => {
        it('should delete reply from database', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );

            const { userPayload, threadPayload, commentPayload, replyPayload } =
                getPayloadDummy();

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);
            await RepliesTableTestHelper.addReply(replyPayload);

            await replyRepositoryPostgres.deleteReply('reply-sam');

            const is_reply_deleted =
                await RepliesTableTestHelper.checkDeletedAtRepliesById(
                    'reply-sam'
                );

            expect(is_reply_deleted).toEqual(true);
        });
    });

    describe('getRepliesThread', () => {
        it('should get replies from threads based on comments', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                {}
            );

            const { userPayload, threadPayload, commentPayload, replyPayload } =
                getPayloadDummy();

            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);
            await CommentsTableTestHelper.addComment(commentPayload);
            await RepliesTableTestHelper.addReply(replyPayload);

            const replies = await replyRepositoryPostgres.getReplies(
                threadPayload.id
            );

            expect(replies).toEqual(expect.any(Array));
            expect(replies[0].id).toEqual(replyPayload.id);
            expect(replies[0].comment_id).toEqual(commentPayload.id);
            expect(replies[0].username).toEqual(userPayload.username);
            expect(replies[0].date).toBeDefined();
            expect(replies[0].content).toEqual('reply from stranger');
            expect(replies[0].deleted_at).toBeDefined();
            expect(replies[0].is_delete).toEqual(false);
        });
    });
});
