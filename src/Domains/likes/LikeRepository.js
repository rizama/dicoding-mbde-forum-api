class LikeRepository {
    async addLike(addLike) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyAvailableLike(threadId, commentId, userId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteLike(id) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikeByThreadId(threadId) {
      throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
