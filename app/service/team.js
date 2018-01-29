'use strict'

const Service = require('egg').Service

class TeamService extends Service {
  async findById(id) {
    const result = await this.app.mysql.get('team', { id })
    return result
  }

  async findByUserId(userId) {
    let _sql = 'select t.id, t.name from team t, '
    _sql += ' (select teamId from r_team_user where userId = ?) r '
    _sql += ' where t.id = r.teamId'
    const result = await this.app.mysql.query(_sql, userId)
    return result
  }

  async create(team) {
    team.createTime = this.app.mysql.literals.now
    const result = await this.app.mysql.insert('team', team)
    return result
  }

  async delete(id) {
    const result = await this.app.mysql.delete('user', { id })
    return result
  }

  async update(team) {
    const result = await this.app.mysql.update('team', team)
    return result
  }
}

module.exports = TeamService
