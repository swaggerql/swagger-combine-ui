const Koa = require('koa')
const Router = require('@koa/router')
const serve = require('koa-static')
const ControllerApiDocs = require('./lib/controllers/api-docs')

const app = new Koa()
const router = new Router()
const controllerApiDocs = new ControllerApiDocs({file: 'swagger.yaml'})

// Force to exit in docker
process.on('SIGINT', process.exit)
process.on('SIGTERM', process.exit)

router.get('/ping', (ctx) => ctx.body = '')
    .get('/swagger.json', controllerApiDocs.getApiDocsHandle())

app
    .use(serve('node_modules/swagger-ui-dist'))
    .use(router.routes())
    .listen(3000)
