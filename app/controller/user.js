'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')
const md5 = require('blueimp-md5')

class UserController extends Controller {
  async index() {
    const params = this.ctx.query
    let result
    if (params.teamId) {
      result = await this.service.user.findByParamsAndTeamId(params)
    } else {
      result = await this.service.user.findByParamsAndGroupId(params)
    }
    this.success(result)
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
        delete result.password
        this.success(result)
      } else {
        this.error(ERROR.MSG_USER_LOGIN_FAILED)
      }
    } else {
      this.error(ERROR.MSG_USER_LOGIN_FAILED)
    }
  }

  async create() {
    const params = this.ctx.request.body
    console.log(params)
    const user = params.user
    let result = await this.service.user.findByUsername(user.username)
    if (result) {
      this.error(ERROR.MSG_USER_CREATE_ERROR_USERNAME)
      return
    }
    user.password = md5(user.password, this.config.md5Key)
    result = await this.service.user.create(user, params.teamId)
    console.log(result)
    const success = this.checkResult('create', result)
    if (success) {
      this.success({ id: result.id })
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
}

module.exports = UserController
