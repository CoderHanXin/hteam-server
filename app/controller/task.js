'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class TaskController extends Controller {
  async index() {
    this.ctx.body = 'This is task api for HTeam.'
  }

  async create() {
    const task = this.ctx.request.body
    const result = await this.service.task.create(task)
    const success = this.checkResult('create', result)
    if (success) {
      this.success({ id: result.insertId })
    } else {
      this.error(ERROR.MSG_USER_CREATE_ERROR)
    }
  }

  async update() {
    const task = this.ctx.request.body
    const result = await this.service.task.update(task)
    const success = this.checkResult('update', result)
    if (success) {
      this.success({ id: result.insertId })
    } else {
      this.error(ERROR.MSG_USER_UPDATE_ERROR)
    }
  }
}

module.exports = TaskController
