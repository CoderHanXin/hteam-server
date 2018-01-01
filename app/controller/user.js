'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  /**
   * default router
   */
  async index() {
    this.ctx.body = 'This is user api for HTeam.'
  }

  /**
   * login
   * @param {string} username 用户名
   * @param {string} password 密码
   * @description return {code:0, message:'', user:user}
   */
  async login() {
    const username = this.ctx.query.username
    const password = this.ctx.query.password
    const result = await this.service.user.login({ username })

    const response = { code: 0, message: '' }
    if (result) {
      if (password === result.password) {
        response.message = '登录成功'
        response.user = result
      } else {
        response.code = 1
        response.message = '用户名或密码错误'
      }
    } else {
      response.code = 1
      response.message = '用户名或密码错误'
    }
    this.ctx.body = response
    this.ctx.status = 200
  }
}

module.exports = UserController
