import Redis from 'ioredis';
const redis = new Redis();

export const cache = (key, value, duration = 3600) => {
    redis.set(key, JSON.stringify(value), 'EX', duration);
};

export const getCache = async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};
