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

  async delete(id) {
    const result = await this.app.model.Group.destroy({
      where: { id }
    })
    return result
  }

  async update(group, users) {
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
    const editGroup = await this.app.model.Group.findById(group.id)
    return this.app.model
      .transaction(t => {
        return editGroup.update(group, { transaction: t }).then(result => {
          return editGroup.setUsers(userList, { transaction: t })
        })
      })
      .then(result => {
        return result
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }
}

module.exports = GroupService
