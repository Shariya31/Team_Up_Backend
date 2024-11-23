import NodeCache from 'node-cache'

const cache = new NodeCache({stdTTL: 3600, checkperiod: 120 })

export const setCache = (key, value)=>{
    cache.set(key, value)
}

export const getCache = (key)=>{
    return cache.get(key)
}

export const deleteCache = (key)=>{
    cache.del(key)
}

export default cache