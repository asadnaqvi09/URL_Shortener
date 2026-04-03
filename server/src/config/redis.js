import redis from 'ioredis'

const redisLog = new redis({
    host: '127.0.0.1',
    port: 6379
})

export default redisLog;