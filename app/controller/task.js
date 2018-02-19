'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class TaskController extends Controller {
  async index() {
    const { projectId, done } = this.ctx.query
    let result
    if (done === undefined) {
      result = await this.service.task.findAllByProjectId(projectId)
    } else {
      result = await this.service.task.findByProjectId(projectId, done)
    }
    this.success(result)
  }

  async show() {
    const id = this.ctx.params.id
    const result = await this.service.task.findById(id)
    this.success(result)
  }

  async create() {
    const { task, event } = this.ctx.request.body
    const result = await this.service.task.create(task, event)
    this.success(result)
  }

  async update() {
    const id = this.ctx.params.id
    const task = this.ctx.request.body
    task.id = id
    const result = await this.service.task.update(task)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_ERROR)
    }
  }

  async createComment() {
    const id = this.ctx.params.id
    const comment = this.ctx.request.body
    comment.task_id = id
    const result = await this.service.task.createComment(comment)
    this.success(result)
  }
}

module.exports = TaskController
