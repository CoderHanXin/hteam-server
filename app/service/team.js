'use strict'

const Service = require('egg').Service

class TeamService extends Service {
  async findById(id) {
    const result = await this.app.model.Team.findById(id)
    return result
  }

  async findByUserId(userId) {
    const user = await this.app.model.User.findById(userId)
    const result = await user.getTeams()
    return result
  }

  async create(team) {
    const result = await this.app.model.Team.create(team)
    return result
  }

  async update(team) {
    const result = await this.app.model.Team.update(team, {
      where: { id: team.id }
    })
    return result
  }

  async removeUser(teamId, userId) {
    const team = await this.app.model.Team.findById(teamId)
    const user = await this.app.model.User.findById(userId)
    const result = await team.removeUser(user)
    return result
  }
}

module.exports = TeamService
