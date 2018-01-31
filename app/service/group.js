'use strict'

const Service = require('egg').Service

class GroupService extends Service {
  async findByTeamId(teamId) {
    const result = await this.app.mysql.select('t_group', {
      where: { teamId },
      orders: ['sort', 'asc']
    })
    return result
  }

  async create(group, users) {
    const conn = await this.app.mysql.beginTransaction()
    try {
      group.createTime = this.app.mysql.literals.now
      const result = await conn.insert('t_group', group)
      const rGroupUser = {}
      for (const userId of users) {
        rGroupUser.groupId = result.insertId
        rGroupUser.userId = userId
        await conn.insert('r_group_user', rGroupUser)
        await this.updateGroupsForTeamUser(group.teamId, userId, conn)
      }
      await conn.commit()
      return result
    } catch (error) {
      await conn.rollback()
      throw error
    }
  }

  async updateGroupsForTeamUser(teamId, userId, conn) {
    const values = []
    let _sql = ' select g.id groupId, g.name groupName from '
    _sql += ' (select id, name from t_group where teamId = ?) g, '
    values.push(teamId)
    _sql += ' (select * from r_group_user where userId = ?) r '
    values.push(userId)
    _sql += ' where g.id = r.groupId'
    console.log(_sql)
    const result = await conn.query(_sql, values)
    console.log(result)
    console.log(JSON.parse(JSON.stringify(result)))

    _sql =
      'update r_team_user set groups = (\'' +
      JSON.stringify(result) +
      '\') where teamId = ? and userId = ?'
    await conn.query(_sql, values)
  }

  async delete(id) {
    const result = await this.app.mysql.delete('t_group', { id })
    return result
  }

  async update(group) {
    const result = await this.app.mysql.update('t_group', group)
    return result
  }
}

module.exports = GroupService
