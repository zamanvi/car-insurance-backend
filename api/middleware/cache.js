import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.path}_${req.userId || 'public'}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`Cache hit for ${key}`);
      return res.json(cachedResponse);
    }

    const originalJson = res.json;

    res.json = function(data) {
      if (res.statusCode === 200) {
        cache.set(key, data, duration);
      }
      originalJson.call(this, data);
    };

    next();
  };
};

export const clearCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};
