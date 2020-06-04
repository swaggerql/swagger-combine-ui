# Swagger Combine UI
[![Build Status](https://travis-ci.org/swaggerql/swagger-combine-ui.svg?branch=master)](https://travis-ci.org/swaggerql/swagger-combine-ui)

The service is used to combine the documentation of various services and display it.

When you should use `swagger-combine-ui`:
- You have a certain number of microservices and you need to combine their Swagger into one interface

## Configuration

The default path for the configuration file is `./swagger.yaml`

Swagger Combine UI requires one configuration schema which resembles a standard Swagger schema except for an additional `apis` field.

For informations about configuration have a look at the documentation of [swagger-combine](https://github.com/maxdome/swagger-combine#configuration).

### APIs difference

#### `url` field

URL or query path to swagger apidocs.
If the `url` field contains a path, then the full url is formed from the request headers:
- `Host` header is used as the domain.
- `X-Forwarded-Proto` header is used as a schema. Schema is `http` by default.

## Docker

```sh
docker run -d -p 3000:3000 -v /path/to/swagger.yaml:/app/swagger.yaml swaggerql/swagger-combine-ui
```
