# Swagger Combine UI
[![Build Status](https://travis-ci.org/swaggerql/swagger-combine-ui.svg?branch=master)](https://travis-ci.org/swaggerql/swagger-combine-ui)

The service is used to combine the documentation of various services and display it behind the balancer.

## Configuration

The default path for the configuration file is `./swagger.yaml`

Swagger Combine UI requires one configuration schema which resembles a standard Swagger schema except for an additional apis field.

For informations about configuration have a look at the documentation of [swagger-combine](https://github.com/maxdome/swagger-combine#configuration).

## Docker

```sh
docker run -d -p 3000:3000 swaggerql/swagger-combine-ui
```
