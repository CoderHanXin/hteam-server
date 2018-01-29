'use strict'

const Service = require('egg').Service

class GroupService extends Service {
  async findByTeamId(teamId) {
    const result = await this.app.mysql.select('group', {
      where: { teamId },
      orders: ['sort', 'asc']
    })
    return result
  }

  async create(group) {
    group.createTime = this.app.mysql.literals.now
    const result = await this.app.mysql.insert('group', group)
    return result
  }

  async delete(id) {
    const result = await this.app.mysql.delete('group', { id })
    return result
  }

  async update(group) {
    const result = await this.app.mysql.update('group', group)
    return result
  }
}

module.exports = GroupService
