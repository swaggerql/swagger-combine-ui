const expect = require('chai').expect
const sinon = require('sinon')
const resolver = require('../../lib/resolver')
const httpResolver = require('json-schema-ref-parser/lib/resolvers/http')


describe('resolver', () => {
    describe('canRead', () => {
        it('file is url', async () => {
            expect(await resolver.canRead({url: 'http://localhost:8080/swagger.json'}))
                .to.be.a('boolean')
                .is.true
            expect(await resolver.canRead({url: 'https://localhost:8080/swagger.json'}))
                .to.be.a('boolean')
                .is.true
            expect(await resolver.canRead({url: 'file://swagger.json'}))
                .to.be.a('boolean')
                .is.false
        })
    })

    describe('read', () => {
        let httpResolverStub

        function stubHttpResolver(json) {
            httpResolverStub = sinon.stub(httpResolver, 'read')
                .returns(Promise.resolve(json))
        }

        afterEach(() => {
            httpResolverStub.restore()
        })


        it('resolve swagger', async () => {
            stubHttpResolver('{"swagger":"2.0","info":{"title":"A","version":"1.0.0"},"paths":{}}')
            expect(await resolver.read({url: 'http://localhost:8080/swagger.json'}))
                .to.be.a('string')
                .is.eq('{"swagger":"2.0","info":{"title":"A","version":"1.0.0"},"paths":{}}')
        })

        it('springfox fix', async () => {
            stubHttpResolver('{"definitions":{}}')
            expect(await resolver.read({url: 'http://localhost:8080/swagger.json'}))
                .to.be.a('string')
                .is.eq('{"definitions":{"LocalDate":{"type":"string","format":"date"}}}')
        })

        it('maximum call stack fix', async () => {
            stubHttpResolver(
                JSON.stringify({
                    definitions: {
                        File: {
                            properties: {
                                absoluteFile: {schema: {'$ref': '#/definitions/File'}},
                                canonicalFile: {schema: {'$ref': '#/definitions/File'}},
                                parentFile: {schema: {'$ref': '#/definitions/File'}}
                            }
                        }
                    }
                })
            )
            expect(await resolver.read({url: 'http://localhost:8080/swagger.json'}))
                .to.be.a('string')
                .is.eq('{"definitions":{"File":{"properties":{"absoluteFile":{"type":"object"},"canonicalFile":{"type":"object"},"parentFile":{"type":"object"}}},"LocalDate":{"type":"string","format":"date"}}}')
        })

        it('resolve openapi', async () => {
            stubHttpResolver('{"openapi":"3.0.1","info":{"title":"B","version":"1.0.1"},"paths":{}}')
            expect(await resolver.read({url: 'http://localhost:8080/swagger.json'}))
                .to.be.a('string')
                .is.eq('{"info":{"title":"B","version":"1.0.1"},"paths":{},"swagger":"2.0"}')
        })
    })
})
