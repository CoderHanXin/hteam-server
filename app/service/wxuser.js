'use strict'

const Service = require('egg').Service

class WxuserService extends Service {
  async findOrCreate(openid) {
    let result
    await this.app.model.Wxuser.findOrCreate({
      where: { openid }
    }).spread((wxuser, created) => {
      result = { wxuser: wxuser.get({ plain: true }), created }
    })
    return result
  }
}

module.exports = WxuserService
