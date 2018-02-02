'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')
const md5 = require('blueimp-md5')

class UserController extends Controller {
  async index() {
    const params = this.ctx.query
    let result
    if (params.teamId) {
      result = await this.service.user.findByParamsWithTeamId(params)
    } else {
      result = await this.service.user.findByParamsWithGroupId(params)
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
    const user = params.user
    // 判断用户名是否已被使用
    let result = await this.service.user.findByUsername(user.username)
    if (result) {
      this.error(ERROR.MSG_USER_CREATE_ERROR_USERNAME)
      return
    }
    // md5 格式化密码
    user.password = md5(user.password, this.config.md5Key)
    // 创建用户
    result = await this.service.user.create(user, params.teamId)
    // 返回user前删除密码字段
    delete result.password
    this.success(result)
  }

  async delete() {
    const id = this.ctx.params.id
    const result = await this.service.user.delete(id)
    if (!result) {
      this.success()
    } else {
      this.error(ERROR.MSG_USER_DELETE_ERROR)
    }
  }

  async update() {
    const id = this.ctx.params.id
    const user = this.ctx.request.body
    user.id = id
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
