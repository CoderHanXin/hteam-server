'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')
const md5 = require('blueimp-md5')

class UserController extends Controller {
  async index() {
    const params = this.ctx.query
    const result = {}
    if (params.teamId) {
      const users = await this.service.user.findByParamsWithTeamId(params)
      const groups = await this.service.group.findByTeamId(params.teamId)
      result.users = users
      result.groups = groups
    } else {
      result.users = await this.service.user.findByParamsWithGroupId(params)
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
    const result = await this.service.user.loginByUsername(username)

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
    const { user, teamId } = this.ctx.request.body
    // 判断用户名是否已被使用
    let result = await this.service.user.findByUsername(user.username)
    if (result) {
      this.error(ERROR.MSG_USER_CREATE_ERROR_USERNAME)
      return
    }
    // md5 格式化密码
    user.password = md5(user.password, this.config.md5Key)
    // 创建用户
    result = await this.service.user.create(user, teamId)
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

  async changePassword() {
    const { id, oldPass, newPass, rePass } = this.ctx.request.body
    if (
      oldPass.trim() === '' ||
      newPass.trim() === '' ||
      rePass.trim() === ''
    ) {
      this.error(ERROR.MSG_USER_PASSWORD_ERROR_EMPTY)
      return
    }
    if (newPass !== rePass) {
      this.error(ERROR.MSG_USER_PASSWORD_ERROR_VERIFY)
      return
    }

    const user = await this.service.user.findById(id)

    if (user.password !== md5(oldPass, this.config.md5Key)) {
      this.error(ERROR.MSG_USER_PASSWORD_ERROR_WRONG)
      return
    }

    const result = await this.service.user.updatePassword(
      id,
      md5(newPass, this.config.md5Key)
    )

    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_ERROR)
    }
  }
}

module.exports = UserController
