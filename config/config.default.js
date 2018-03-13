'use strict'

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'this_is_cookie_secret_key'

  // 密码加密的key
  config.md5Key = 'this_is_password_secret_key'

  config.middleware = ['jwt']

  config.security = {
    csrf: {
      ignore: '/api',
      ignoreJSON: false
    },
    domainWhiteList: ['http://localhost:9001']
  }

  config.cors = {
    allowMethods: 'HEAD,OPTIONS,GET,POST,PUT,DELETE',
    allowHeaders: 'content-type,authorization',
    credentials: true
  }

  config.jwt = {
    secret: 'this_is_jwt_secret_key',
    enable: true,
    ignore: ['/api/account/login', '/api/account']
  }

  // 七牛配置，上传图片用
  config.qiniu = {
    accessKey: 'your_access_key',
    secretKey: 'your_secret_key',
    bucket: 'your_bucket'
  }

  return config
}
