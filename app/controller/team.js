'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class TeamController extends Controller {
  /**
   * 查询用户的所属团队
   */
  async index() {
    const userId = this.ctx.query.userId
    const result = await this.service.team.findByUserId(userId)
    this.success(result)
  }

  async show() {
    const id = this.ctx.params.id
    const result = await this.service.team.findById(id)
    this.success(result)
  }

  async create() {
    const { name, userId } = this.ctx.request.body
    const result = await this.service.team.create(name, userId)
    this.success(result)
  }

  async delete() {
    const id = this.ctx.query.id
    const result = await this.service.team.delete(id)
    const success = this.checkResult('delete', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_TEAM_DELETE_ERROR)
    }
  }

  async update() {
    const team = this.ctx.request.body
    const result = await this.service.team.update(team)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_TEAM_UPDATE_ERROR)
    }
  }

  async removeUser() {
    const teamId = this.ctx.params.teamId
    const userId = this.ctx.params.userId
    const result = await this.service.team.removeUser(teamId, userId)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_TEAM_REMOVE_USER_ERROR)
    }
  }
}

module.exports = TeamController
