'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class TaskController extends Controller {
  async index() {
    const { projectId, userId, done } = this.ctx.query
    let result
    if (projectId) {
      if (done === undefined) {
        result = await this.service.task.findAllByProjectId(projectId)
      } else {
        result = await this.service.task.findByProjectId(projectId, done)
      }
    } else {
      result = await this.service.task.findByUserId(userId, done)
    }
    this.success(result)
  }

  async page() {
    const { userId, done, page, size } = this.ctx.query
    console.log(`page:${page}`)
    console.log(`size:${size}`)
    const result = await this.service.task.pageByUserId(userId, done, page, size)
    this.success(result)
  }

  async show() {
    const id = this.ctx.params.id
    const result = await this.service.task.findById(id)
    this.success(result)
  }
  async showEvents() {
    const id = this.ctx.params.id
    const result = await this.service.task.findEventsById(id)
    this.success(result)
  }

  async create() {
    const { task, event } = this.ctx.request.body
    const result = await this.service.task.create(task, event)
    this.success(result)
  }

  async update() {
    const id = this.ctx.params.id
    const { task, event } = this.ctx.request.body
    task.id = id
    const result = await this.service.task.update(task, event)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_TASK_UPDATE_ERROR)
    }
  }

  async delete() {
    const id = this.ctx.params.id
    const result = await this.service.task.delete(id)
    if (!result) {
      this.success()
    } else {
      this.error(ERROR.MSG_TASK_DELETE_ERROR)
    }
  }

  async addTag() {
    const taskId = this.ctx.params.id
    const { tagId, event } = this.ctx.request.body
    await this.service.task.addTag(taskId, tagId, event)
    this.success()
  }

  async removeTag() {
    const taskId = this.ctx.params.id
    const { tagId, event } = this.ctx.request.body
    await this.service.task.removeTag(taskId, tagId, event)
    this.success()
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
