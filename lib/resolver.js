'use strict'

const resolver = require('json-schema-ref-parser/lib/resolvers/http')
const converter = require('api-spec-converter')

// Monkey patching
const HTTPResolver = {
    canRead(file) {
        return resolver.canRead(file)
    },
    async read(file) {
        let swagger

        try {
            const data = await resolver.read(file)
            swagger = JSON.parse(data.toString())

            if (swagger.openapi && swagger.openapi.indexOf('3.') === 0) {
                const converted = await converter.convert({
                    from: 'openapi_3',
                    to: 'swagger_2',
                    source: swagger
                })
                swagger = converted.spec
            }

            // Fix springfox bug
            // LocalDate used but not defined
            if (!swagger.definitions.LocalDate) {
                swagger.definitions.LocalDate = {
                    type: 'string',
                    format: 'date'
                }
            }
            // Fix Maximum call stack size exceeded
            // https://github.com/APIDevTools/json-schema-ref-parser/issues/36
            if (swagger.definitions.File && swagger.definitions.File.properties.absoluteFile) {
                swagger.definitions.File.properties.absoluteFile = {type: 'object'}
                swagger.definitions.File.properties.canonicalFile = {type: 'object'}
                swagger.definitions.File.properties.parentFile = {type: 'object'}
            }
        } catch (error) {
            throw Error(error.message)
        }

        return Promise.resolve(JSON.stringify(swagger))
    }
}

module.exports = HTTPResolver
