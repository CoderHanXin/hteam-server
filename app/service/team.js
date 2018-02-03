'use strict'

const Service = require('egg').Service

class TeamService extends Service {
  async findById(id) {
    const result = await this.app.mysql.get('t_team', { id })
    return result
  }

  async findByUserId(userId) {
    let _sql = 'select t.id, t.name from t_team t, '
    _sql += ' (select teamId from r_team_user where userId = ?) r '
    _sql += ' where t.id = r.teamId'
    const result = await this.app.mysql.query(_sql, userId)
    return result
  }

  async create(team) {
    team.createTime = this.app.mysql.literals.now
    const result = await this.app.mysql.insert('t_team', team)
    return result
  }

  async delete(id) {
    const result = await this.app.mysql.delete('t_team', { id })
    return result
  }

  async update(team) {
    const result = await this.app.mysql.update('t_team', team)
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
