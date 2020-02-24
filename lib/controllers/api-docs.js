'use strict'

const swaggerCombine = require('swagger-combine')
const $RefParser = require('json-schema-ref-parser')
const resolver = require('../resolver')

class ApiDocs {
    constructor(options) {
        this.options = options || {}
        this.init(this.options.file || 'swagger.yaml')
    }

    async init(file) {
        console.log(`Load ${file}`)
        this.swagger = await $RefParser.dereference(file)

        if (!this.swagger.apis) {
            console.error('Swagger schema does not have apis property')
        }
    }

    patchUrls(scheme, host) {
        const swagger = Object.assign({}, this.swagger)

        for (let item of swagger.apis) {
            if (item.url.indexOf('http') !== 0) {
                item.url = `${scheme}://${host}${item.url}`
            }
        }

        return swagger
    }

    getApiDocsHandle() {
        return async (ctx, next) => {
            const swagger = this.patchUrls(
                ctx.request.header['X-Forwarded-Proto'] || 'http',
                ctx.request.header.host)

            try {
                ctx.body = await swaggerCombine(swagger, {resolve: {http: resolver}})
            } catch (error) {
                console.error(error)
                ctx.body = {code: 500, error: error.message}
                ctx.status = 500
            }
        }
    }
}

module.exports = ApiDocs
