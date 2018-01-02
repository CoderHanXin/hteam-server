'use strict'

const Controller = require('../base/base_controller')

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

    if (result) {
      if (password === result.password) {
        this.success(result)
      } else {
        this.error(-1, '用户名或密码错误')
      }
    } else {
      this.error(-1, '用户名或密码错误')
    }
    this.ctx.status = 200
  }

  async create() {
    const user = this.ctx.request.body
    const result = await this.service.user.create(user)
    const success = this.checkResult(result)
    if (success) {
      this.success({ id: result.insertId })
    } else {
      this.error(-1, '创建用户失败')
    }
  }
}

module.exports = UserController
