'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

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
    const username = this.ctx.request.body.username
    const password = this.ctx.request.body.password
    const result = await this.service.user.login({ username })

    if (result) {
      if (password === result.password) {
        this.success(result)
      } else {
        this.error(ERROR.MSG_USER_LOGIN_FAILED)
      }
    } else {
      this.error(ERROR.MSG_USER_LOGIN_FAILED)
    }
    this.ctx.status = 200
  }

  async create() {
    const user = this.ctx.request.body
    const result = await this.service.user.create(user)
    const success = this.checkResult('create', result)
    if (success) {
      this.success({ id: result.insertId })
    } else {
      this.error(ERROR.MSG_USER_CREATE_ERROR)
    }
  }

  async delete() {
    const id = this.ctx.query.id
    const result = await this.service.user.delete(id)
    const success = this.checkResult('delete', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_USER_DELETE_ERROR)
    }
  }

  async update() {
    const user = this.ctx.request.body
    const result = await this.service.user.update(user)
    const success = this.checkResult('update', result)
    if (success) {
      this.success({ id: result.insertId })
    } else {
      this.error(ERROR.MSG_USER_UPDATE_ERROR)
    }
  }
}

module.exports = UserController
