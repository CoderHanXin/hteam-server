'use strict'

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1514796185563_8404'

  // add your config here
  config.middleware = []

  config.security = {
    csrf: {
      ignore: '/api',
      ignoreJSON: false,
    },
    domainWhiteList: ['http://localhost:9001'],
  }

  config.cors = {
    allowMethods: 'HEAD,OPTIONS,GET,POST,PUT,DELETE',
    allowHeaders: 'content-type',
    credentials: true,
  }

  return config
}
