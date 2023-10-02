const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('replies endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    async function getAccessToken(server) {
        const loginPayload = {
            username: 'rizkysamp',
            password: 'secret',
        };

        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'rizkysamp',
                password: 'secret',
                fullname: 'Dicoding Indonesia',
            },
        });

        const authentication = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: loginPayload,
        });

        const responseAuth = JSON.parse(authentication.payload);
        return responseAuth.data.accessToken;
    }

    describe('when POST threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 if payload not access token', async () => {
            const server = await createServer(container);

            const responseReply = await server.inject({
                method: 'POST',
                url: '/threads/thread-456/comments/comment-sam/replies',
                payload: {},
            });

            const responseJson = JSON.parse(responseReply.payload);

            expect(responseReply.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 404 if thread id not valid', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const responseReply = await server.inject({
                method: 'POST',
                url: '/threads/thread-zzz/comments/comment-yyy/replies',
                payload: {
                    content: 'sebuah balasan',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(responseReply.payload);

            expect(responseReply.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan!');
        });

        it('should response 404 if comment id not valid', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            // add thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah thread',
                    body: 'sebuah body thread',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            // add reply
            const responseReply = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/xxxx/replies`,
                payload: {
                    content: 'sebuah balasan',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(responseReply.payload);

            expect(responseReply.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan!');
        });

        it('should response 400 if payload reply not contain needed property', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'test title thread',
                    body: 'sebuah lagu sebuah cerita',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'komentar netijen jahat',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentResponse = JSON.parse(comment.payload);

            const responseReply = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(responseReply.payload);

            expect(responseReply.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'gagal membuat balasan baru, properti yang dibutuhkan tidak ada'
            );
        });

        it('should response 400 if payload not meet data type specification', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'test title thread',
                    body: 'sebuah lagu sebuah cerita',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'komentar netijen jahat',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentResponse = JSON.parse(comment.payload);

            const replyResponse = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
                payload: {
                    content: 34923847923847,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(replyResponse.payload);

            expect(replyResponse.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'gagal membuat balasan baru, tipe data tidak sesuai'
            );
        });

        it('should response 201 and return addedComment', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'test title thread',
                    body: 'sebuah lagu sebuah cerita',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'komentar netijen jahat',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentResponse = JSON.parse(comment.payload);

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
                payload: {
                    content: 'balasan dari sebuah komentar',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply.content).toEqual(
                'balasan dari sebuah komentar'
            );
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{}/replies/{id}', () => {
        it('should response 404 if thread not found', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/xxx/comments/xxx',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan!');
        });

        it('should response 404 if comment not found', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'judul',
                    body: 'body thread',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/abc`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'komentar tidak ditemukan!'
            );
        });

        it('should response 404 if reply not found', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'title thread',
                    body: 'body thread',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'content komentar',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentResponse = JSON.parse(comment.payload);

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/abc`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'balasan tidak ditemukan!'
            );
        });

        it('should response 403 if another user delete the comment', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'sebuah thread',
                    body: 'sebuah body thread',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'sebuah komentar',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentResponse = JSON.parse(comment.payload);

            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
                payload: {
                    content: 'sebuah balasan',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const replyResponse = JSON.parse(reply.payload);

            // Other user
            const loginPayload_2 = {
                username: 'samsam',
                password: 'secret3',
            };

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: loginPayload_2.username,
                    password: loginPayload_2.password,
                    fullname: 'rsp',
                },
            });

            const authentication_2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload_2,
            });

            const responseAuth_2 = JSON.parse(authentication_2.payload);

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${replyResponse.data.addedReply.id}`,
                headers: {
                    Authorization: `Bearer ${responseAuth_2.data.accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak bisa menghapus balasan orang lain.'
            );
        });

        it('should response 200 and return success', async () => {
            const server = await createServer(container);

            const accessToken = await getAccessToken(server);

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'a thread',
                    body: 'a body thread',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const threadResponse = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments`,
                payload: {
                    content: 'a comment',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const commentResponse = JSON.parse(comment.payload);

            const reply = await server.inject({
                method: 'POST',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
                payload: {
                    content: 'a balasan',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const replyResponse = JSON.parse(reply.payload);

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${replyResponse.data.addedReply.id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
