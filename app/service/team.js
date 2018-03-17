'use strict'

const Service = require('egg').Service
const ROLE = require('../common/role')

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

  async create(name, userId) {
    let plain
    return this.app.model
      .transaction(t => {
        return this.app.model.Team.create({ name }, { transaction: t }).then(
          result => {
            plain = result.get({ plain: true })
            return this.app.model.TeamUser.create(
              {
                team_id: plain.id,
                user_id: userId,
                role_id: ROLE.SUPERADMIN,
                role_name: ROLE.SUPERADMIN_TITLE
              },
              { transaction: t }
            )
          }
        )
      })
      .then(result => {
        plain.team_user = result
        return plain
      })
      .catch(error => {
        console.log(error)
        throw error
      })
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
