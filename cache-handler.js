module.exports = class CacheHandler {
  constructor(options) {
    this.options = options || {};
    this.cache = new Map();
  }

  async get(key) {
    return this.cache.get(key);
  }

  async set(key, data, options) {
    this.cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: options?.tags || []
    });
    return;
  }

  async revalidateTag(tag) {
    // Iterate through cache and remove entries with matching tags
    for (const [key, value] of this.cache.entries()) {
      if (value.tags && value.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }
} 