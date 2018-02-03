'use strict'

const Service = require('egg').Service

class GroupService extends Service {
  async findByTeamId(teamId) {
    const groups = await this.app.model.Group.findAll({
      include: [{ model: this.app.model.User }],
      where: { team_id: teamId }
      // order: ['sort', 'ASC']
    })
    const result = []
    for (const group of groups) {
      result.push(group.get({ plain: true }))
    }
    return result
  }

  async create(group, users) {
    let plain
    let userList
    if (users) {
      userList = await this.app.model.User.findAll({
        where: {
          id: {
            $in: users
          }
        }
      })
    }
    return this.app.model
      .transaction(t => {
        group.team_id = group.teamId
        delete group.teamId
        return this.app.model.Group.create(group, { transaction: t }).then(
          result => {
            plain = result.get({ plain: true })
            if (userList) {
              return result.addUsers(userList, { transaction: t })
            }
            return 1
          }
        )
      })
      .then(result => {
        return plain
      })
      .catch(error => {
        console.log(error)
        throw error
      })
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
      "update r_team_user set groups = ('" +
      JSON.stringify(result) +
      "') where teamId = ? and userId = ?"
    await conn.query(_sql, values)
  }

  async delete(id) {
    const result = await this.app.model.Group.destroy({
      where: { id }
    })
    return result
  }

  async update(group) {
    const result = await this.app.mysql.update('t_group', group)
    return result
  }
}

module.exports = GroupService
