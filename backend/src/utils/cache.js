const cache = new Map();

export const setCache = (key, data, ttl = 60) => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl * 1000,
  });
};

export const getCache = (key) => {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
};