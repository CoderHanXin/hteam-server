'use strict'

const Controller = require('egg').Controller

class UserController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg'
  }

  async login() {
    const username = this.ctx.request.body.username
    const password = this.ctx.request.body.password
    const result = this.service.user.login(username)

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
