'use strict'

const Service = require('egg').Service

const WXMP_LOGIN_URL =
  'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code'

class WechatService extends Service {
  /**
   * 使用临时登录凭证 code 获取 session_key 和 openid
   *
   * @param  {String} code 临时登录凭证
   * @return {Object} {openid, session_key, expires_in }
   */
  async getOpenidAndSessionKey(code) {
    const url = WXMP_LOGIN_URL.replace('APPID', this.config.wxmp.appid)
      .replace('SECRET', this.config.wxmp.secret)
      .replace('JSCODE', code)
    const result = await this.ctx.curl(url, {
      method: 'get',
      dataType: 'json',
      contentType: 'json'
    })
    return result
  }
}

module.exports = WechatService
