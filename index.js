const {server} = require('./src/apps/web.js')
const {logger}= require('./src/apps/logging.js')

server.listen(process.env.PORT || 8080,()=>{
    logger.info(`App start - ${process.env.NODE_ENV}`)
})