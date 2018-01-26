'use strict'

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'this_is_cookie_secret_key'

  // 密码加密的key
  config.md5Key = 'this_is_password_secret_key'

  config.middleware = []

  config.security = {
    csrf: {
      ignore: '/api',
      ignoreJSON: false
    },
    domainWhiteList: ['http://localhost:9001']
  }

  config.cors = {
    allowMethods: 'HEAD,OPTIONS,GET,POST,PUT,DELETE',
    allowHeaders: 'content-type',
    credentials: true
  }

  return config
}
