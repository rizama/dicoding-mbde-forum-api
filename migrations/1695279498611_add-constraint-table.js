/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    // fk for threads table
    pgm.addConstraint(
        'threads',
        'fk_threads.user_id_users.id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
    );

    // fk for comments table
    pgm.addConstraint(
        'comments',
        'fk_comments.user_id_users.id',
        'FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE'
    );

    pgm.addConstraint(
        'comments',
        'fk_comments.thread_id_threads.id',
        'FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE'
    );

    // fk for replies table
    pgm.addConstraint(
        'replies',
        'fk_replies.thread_id_comments.id',
        'FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'replies',
        'fk_replies.comment_id_comments.id',
        'FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'replies',
        'fk_replies.user_id_users.id',
        'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.user_id_users.id');
    pgm.dropConstraint('comments', 'fk_comments.user_id_users.id');
    pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id');
    pgm.dropConstraint('replies', 'fk_replies.thread_id_comments.id');
    pgm.dropConstraint('replies', 'fk_replies.comment_id_comments.id');
    pgm.dropConstraint('replies', 'fk_replies.user_id_users.id');
};

