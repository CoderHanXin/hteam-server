'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class GroupController extends Controller {
  async index() {
    const teamId = this.ctx.query.teamId
    const result = await this.ctx.service.group.findByTeamId(teamId)
    this.success(result)
  }

  async create() {
    const info = this.ctx.request.body
    const result = await this.service.group.create(info.group)
    const success = this.checkResult('create', result)
    if (success) {
      this.success({ id: result.insertId })
    } else {
      this.error(ERROR.MSG_GROUP_CREATE_ERROR)
    }
  }

  async delete() {
    const id = this.ctx.query.id
    const result = await this.service.group.delete(id)
    const success = this.checkResult('delete', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_GROUP_DELETE_ERROR)
    }
  }

  async update() {
    const group = this.ctx.request.body
    const result = await this.service.team.update(group)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_GROUP_UPDATE_ERROR)
    }
  }
}

module.exports = GroupController
