'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class ProjectController extends Controller {
  async index() {
    const teamId = this.ctx.query.teamId
    const result = await this.ctx.service.project.findByTeamId(teamId)
    this.success(result)
  }

  async show() {
    const id = this.ctx.params.id
    const result = await this.service.project.findInfoAndUsersById(id)
    this.success(result)
  }

  async create() {
    const { teamId, project, users } = this.ctx.request.body
    const result = await this.service.project.create(teamId, project, users)
    this.success(result)
  }

  async update() {
    const id = this.ctx.params.id
    const { project, users } = this.ctx.request.body
    project.id = id
    const result = await this.service.project.update(
      project,
      users
    )
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_PROJECT_UPDATE_ERROR)
    }
  }
}

module.exports = ProjectController
