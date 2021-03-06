'use strict'

module.exports = appInfo => {
  const config = (exports = {})
  const clientRoot = 'http://localhost:9001'
  // 前端地址
  config.clientRoot = clientRoot

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
    domainWhiteList: [clientRoot]
  }

  config.cors = {
    allowMethods: 'HEAD,OPTIONS,GET,POST,PUT,DELETE',
    allowHeaders: 'content-type,authorization',
    credentials: true
  }

  config.jwt = {
    secret: 'this_is_jwt_secret_key',
    enable: true,
    ignore: ['/api/account']
  }

  // 微信小程序配置
  config.wxmp = {
    appid: 'your_wechat_mini_program_appid',
    secret: 'your_wechat_mini_program_secret'
  }

  // 七牛配置，上传图片用
  config.qiniu = {
    accessKey: 'your_access_key',
    secretKey: 'your_secret_key',
    bucket: 'your_bucket'
  }

  // 发送邮件配置
  config.transporter = {
    appName: 'HTeam',
    host: 'smtp.qq.com',
    secure: true,
    port: 465,
    auth: {
      user: 'your_email_address',
      pass: 'your_email_password'
    }
  }

  return config
}
