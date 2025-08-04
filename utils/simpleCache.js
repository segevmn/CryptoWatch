function withCache(fn, ttlSeconds = 30) {
  const store = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    const cached = store.get(key);

    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }

    const value = await fn(...args);
    store.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
    return value;
  };
}

module.exports = { withCache };
