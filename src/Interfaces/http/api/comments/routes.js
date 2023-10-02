const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postCommentHandler,
        options: {
            auth: 'forum_api_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{id}',
        handler: handler.deleteCommentHandler,
        options: {
            auth: 'forum_api_jwt',
        },
    },
];

module.exports = routes;
