/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const PasswordHash = require('../Applications/security/PasswordHash');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepository = require('../Domains/comments/CommentRepository');
const ReplyRepository = require('../Domains/replies/ReplyRepository');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const DeleteAuthenticationUseCase = require('../Applications/use_case/DeleteAuthenticationUseCase');
const ThreadUseCase = require('../Applications/use_case/ThreadUseCase');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const ReplyUseCase = require('../Applications/use_case/ReplyUseCase');
const CommentUseCase = require('../Applications/use_case/CommentUseCase');
const LikeRepository = require('../Domains/likes/LikeRepository');
const LikeRepositoryPostgres = require('./repository/LikeRepositoryPostgres');
const LikeUseCase = require('../Applications/use_case/LikeUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
    {
        key: UserRepository.name,
        Class: UserRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: AuthenticationRepository.name,
        Class: AuthenticationRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
            ],
        },
    },
    {
        key: PasswordHash.name,
        Class: BcryptPasswordHash,
        parameter: {
            dependencies: [
                {
                    concrete: bcrypt,
                },
            ],
        },
    },
    {
        key: AuthenticationTokenManager.name,
        Class: JwtTokenManager,
        parameter: {
            dependencies: [
                {
                    concrete: Jwt.token,
                },
            ],
        },
    },
    {
        key: ThreadRepository.name,
        Class: ThreadRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: CommentRepository.name,
        Class: CommentRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: ReplyRepository.name,
        Class: ReplyRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: LikeRepository.name,
        Class: LikeRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
]);

// registering use cases
container.register([
    {
        key: AddUserUseCase.name,
        Class: AddUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
            ],
        },
    },
    {
        key: LoginUserUseCase.name,
        Class: LoginUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
                {
                    name: 'authenticationTokenManager',
                    internal: AuthenticationTokenManager.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
            ],
        },
    },
    {
        key: LogoutUserUseCase.name,
        Class: LogoutUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
            ],
        },
    },
    {
        key: DeleteAuthenticationUseCase.name,
        Class: DeleteAuthenticationUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
            ],
        },
    },
    {
        key: RefreshAuthenticationUseCase.name,
        Class: RefreshAuthenticationUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
                {
                    name: 'authenticationTokenManager',
                    internal: AuthenticationTokenManager.name,
                },
            ],
        },
    },
    {
        key: ThreadUseCase.name,
        Class: ThreadUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'replyRepository',
                    internal: ReplyRepository.name,
                },
                {
                    name: 'likeRepository',
                    internal: LikeRepository.name,
                },
            ],
        },
    },
    {
        key: CommentUseCase.name,
        Class: CommentUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: ReplyUseCase.name,
        Class: ReplyUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'replyRepository',
                    internal: ReplyRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: LikeUseCase.name,
        Class: LikeUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
                {
                    name: 'commentRepository',
                    internal: CommentRepository.name,
                },
                {
                    name: 'likeRepository',
                    internal: LikeRepository.name,
                },
            ],
        },
    },
]);

module.exports = container;
