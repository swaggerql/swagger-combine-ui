'use strict'

const resolver = require('json-schema-ref-parser/lib/resolvers/http')

// Monkey patching
// Fix springfox bugs
const HTTPResolver = {
    canRead(file) {
        return resolver.canRead(file)
    },
    async read(file) {
        let swagger

        try {
            const data = await resolver.read(file)
            swagger = JSON.parse(data.toString())

            // LocalDate used but not defined
            swagger.definitions.LocalDate = {
                type: 'string',
                format: 'date'
            }
            // Fix Maximum call stack size exceeded
            // https://github.com/APIDevTools/json-schema-ref-parser/issues/36
            if (swagger.definitions.File && swagger.definitions.File.properties.absoluteFile) {
                swagger.definitions.File.properties.absoluteFile = {type: 'object'}
                swagger.definitions.File.properties.canonicalFile = {type: 'object'}
                swagger.definitions.File.properties.parentFile = {type: 'object'}
            }
        } catch (error) {
            throw Error(file, error.message)
        }

        return Promise.resolve(JSON.stringify(swagger))
    }
}

module.exports = HTTPResolver
