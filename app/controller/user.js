'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')
const md5 = require('blueimp-md5')

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
    const { username, password } = this.ctx.request.body
    const result = await this.service.user.findByUsername(username)

    if (result) {
      if (result.password === md5(password, this.config.md5Key)) {
        this.success(result)
      } else {
        this.error(ERROR.MSG_USER_LOGIN_FAILED)
      }
    } else {
      this.error(ERROR.MSG_USER_LOGIN_FAILED)
    }
  }

  async create() {
    const user = this.ctx.request.body
    let result = await this.service.user.findByUsername(user.username)
    if (result) {
      this.error(ERROR.MSG_USER_CREATE_ERROR_USERNAME)
      return
    }
    user.password = md5(user.password, this.config.md5Key)
    result = await this.service.user.create(user)
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
      this.success()
    } else {
      this.error(ERROR.MSG_USER_UPDATE_ERROR)
    }
  }

  async search() {
    const orgId = this.ctx.query.orgId
    const name = this.ctx.query.name
    const status = this.ctx.query.status
    const result = await this.service.user.search(orgId, name, status)
    this.success(result)
  }
}

module.exports = UserController
