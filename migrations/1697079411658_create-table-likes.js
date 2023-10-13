/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
    pgm.addConstraint(
        'likes',
        'fk_likes.thread_id_threads.id',
        'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'likes',
        'fk_likes.comment_id_comments.id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'likes',
        'fk_likes.user_id_users.id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropConstraint('likes', 'fk_likes.thread_id_threads.id');
    pgm.dropConstraint('likes', 'fk_likes.comment_id_comments.id');
    pgm.dropConstraint('likes', 'fk_likes.user_id_users.id');
    pgm.dropTable('likes');
};

