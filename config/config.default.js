'use strict'

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1514796185563_8404'

  // add your config here
  config.middleware = []

  config.security = {
    csrf: { ignoreJSON: true },
    domainWhiteList: ['http://localhost:8080'],
  }

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    allowHeaders: 'content-type',
    credentials: true,
  }

  return config
}
