const InvariantError = require('./InvariantError');

// Refactored Code
const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error;
    },
};

DomainErrorTranslator._directories = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
    ),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat membuat user baru karena tipe data tidak sesuai'
    ),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
    ),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
    ),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'harus mengirimkan username dan password'
    ),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'username dan password harus string'
    ),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
        new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
        new InvariantError('refresh token harus string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
        new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
        new InvariantError('refresh token harus string'),
    'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada'
    ),
    'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'gagal membuat thread baru, tipe data tidak sesuai'
    ),
    'ADD_THREAD.TITLE_LIMIT_CHAR': new InvariantError(
        'tidak dapat membuat user baru karena title melebihi batas limit'
    ),
    'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'gagal membuat thread, beberapa properti yang dibutuhkan tidak ada'
    ),
    'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'gagal membuat thread baru, tipe data tidak sesuai'
    ),
    'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'gagal membuat komentar baru, properti yang dibutuhkan tidak ada'
    ),
    'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'gagal membuat komentar baru, tipe data tidak sesuai'
    ),
    'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'gagal membuat komentar baru, properti yang dibutuhkan tidak ada'
    ),
    'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'gagal membuat komentar baru, tipe data tidak sesuai'
    ),
    'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'gagal membuat balasan baru, properti yang dibutuhkan tidak ada'
    ),
    'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'gagal membuat balasan baru, tipe data tidak sesuai'
    ),
    'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'gagal membuat balasan baru, properti yang dibutuhkan tidak ada'
    ),
    'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'gagal membuat balasan baru, tipe data tidak sesuai'
    ),
};
module.exports = DomainErrorTranslator;
