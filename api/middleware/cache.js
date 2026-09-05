// Simple in-memory TTL cache -- no external dependency (node-cache was
// removed from package.json earlier but this file still imported it,
// which would have crashed the process the moment any route using it
// was actually hit).
const store = new Map();

const isExpired = (entry) => Date.now() > entry.expiresAt;

export const cacheMiddleware = (durationSeconds = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.path}_${req.userId || 'public'}`;
    const entry = store.get(key);

    if (entry && !isExpired(entry)) {
      return res.json(entry.data);
    }
    if (entry) {
      store.delete(key);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        store.set(key, { data, expiresAt: Date.now() + durationSeconds * 1000 });
      }
      return originalJson(data);
    };

    next();
  };
};

export const clearCache = (pattern) => {
  for (const key of store.keys()) {
    if (key.includes(pattern)) {
      store.delete(key);
    }
  }
};
