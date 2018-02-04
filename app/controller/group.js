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
    const params = this.ctx.request.body
    const result = await this.service.group.create(params.group, params.users)
    this.success(result)
  }

  async delete() {
    const id = this.ctx.params.id
    const result = await this.service.group.delete(id)
    if (!result) {
      this.success()
    } else {
      this.error(ERROR.MSG_GROUP_DELETE_ERROR)
    }
  }

  async update() {
    const id = this.ctx.params.id
    const params = this.ctx.request.body
    params.group.id = id
    const result = await this.service.group.update(params.group, params.users)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_GROUP_UPDATE_ERROR)
    }
  }
}

module.exports = GroupController
