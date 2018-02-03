const Service = require('egg').Service
const ROLE = require('../common/role')
class UserService extends Service {
  async loginByUsername(username) {
    const result = await this.app.model.User.findOne({
      include: [{ model: this.app.model.Team }],
      where: { username }
    })
    return result && result.get({ plain: true })
  }

  async findByUsername(username) {
    const result = await this.app.model.User.findOne({
      where: { username }
    })
    return result
  }

  async create(user, teamId) {
    let plain
    return this.app.model
      .transaction(t => {
        return this.app.model.User.create(user, { transaction: t }).then(
          result => {
            plain = result.get({ plain: true })
            return this.app.model.TeamUser.create(
              {
                team_id: teamId,
                user_id: plain.id,
                role_id: ROLE.MEMBER,
                role_name: ROLE.MEMBER_TITLE
              },
              { transaction: t }
            )
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
    // const result = await this.app.model.User.create(user)
    // // const team = await this.app.model.Team.findById(teamId)
    // // await result.addTeam(team, {
    // //   through: { role_id: ROLE.MEMBER, role_name: ROLE.MEMBER_TITLE }
    // // })
    // const plain = result.get({ plain: true })
    // await this.app.model.TeamUser.create({
    //   team_id: teamId,
    //   user_id: plain.id,
    //   role_id: ROLE.MEMBER,
    //   role_name: ROLE.MEMBER_TITLE
    // })
    // return plain
  }

  async delete(id) {
    const result = await this.app.model.User.destroy({
      where: { id }
    })
    return result
  }

  async update(user) {
    const result = await this.app.model.User.update(user, {
      where: {
        id: user.id
      }
    })
    return result
  }

  async findByParamsWithGroupId(params) {
    const group = await this.app.model.Group.findById(params.groupId)
    const users = await group.getUsers({
      where: { status: params.status }
    })
    const result = []
    for (const user of users) {
      result.push(user.get({ plain: true }))
    }
    return result
  }

  async findByParamsWithTeamId(params) {
    const team = await this.app.model.Team.findById(params.teamId)
    const users = await team.getUsers({
      where: { status: params.status }
    })
    const result = []
    for (const user of users) {
      result.push(user.get({ plain: true }))
    }
    return result
  }
}

module.exports = UserService
