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

  async loginByEmail(email) {
    const result = await this.app.model.User.findOne({
      include: [{ model: this.app.model.Team }],
      where: { email }
    })
    return result && result.get({ plain: true })
  }

  async findByIdIncludeTeam(id) {
    const result = await this.app.model.User.findOne({
      include: [{ model: this.app.model.Team }],
      attributes: { exclude: ['username', 'password'] },
      where: { id }
    })
    return result && result.get({ plain: true })
  }

  async findByWxuserIdIncludeTeam(wxuserId) {
    const result = await this.app.model.User.findOne({
      include: [{ model: this.app.model.Team }],
      attributes: { exclude: ['username', 'password'] },
      where: { wxuser_id: wxuserId }
    })
    return result && result.get({ plain: true })
  }

  async findByUsername(username) {
    const result = await this.app.model.User.findOne({
      where: { username }
    })
    return result
  }

  async findByEmail(email) {
    const result = await this.app.model.User.findOne({
      where: { email }
    })
    return result
  }

  async findById(id) {
    const result = await this.app.model.User.findById(id)
    return result && result.get({ plain: true })
  }

  async create(user) {
    const result = await this.app.model.User.create(user)
    return result
  }

  async createTeamUser(user, teamId) {
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
  }

  async findByUserIdAndTeamId(userId, teamId) {
    const result = await this.app.model.TeamUser.findOne({
      where: {
        user_id: userId,
        team_id: teamId
      }
    })
    return result
  }

  async joinTeam(userId, teamId) {
    const result = await this.app.model.TeamUser.create({
      team_id: teamId,
      user_id: userId,
      role_id: ROLE.MEMBER,
      role_name: ROLE.MEMBER_TITLE
    })
    return result
  }

  async joinTeamAndUpdate(user, teamId) {
    return this.app.model
      .transaction(t => {
        return this.app.model.User.update(user, {
          where: {
            id: user.id
          },
          transaction: t
        }).then(result => {
          return this.app.model.TeamUser.create(
            {
              team_id: teamId,
              user_id: user.id,
              role_id: ROLE.MEMBER,
              role_name: ROLE.MEMBER_TITLE
            },
            { transaction: t }
          )
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

  async updatePassword(id, password) {
    const result = await this.app.model.User.update(
      { password },
      {
        where: {
          id
        }
      }
    )
    return result
  }

  async findByGroupId(groupId, status = 1) {
    const group = await this.app.model.Group.findById(groupId)
    const users = await group.getUsers({
      attributes: { exclude: ['username', 'password'] },
      where: { status }
    })
    const result = []
    for (const user of users) {
      result.push(user.get({ plain: true }))
    }
    return result
  }

  async findByTeamId(teamId, status = 1) {
    const team = await this.app.model.Team.findById(teamId)
    const users = await team.getUsers({
      attributes: { exclude: ['username', 'password'] },
      where: { status }
    })
    const result = []
    for (const user of users) {
      result.push(user.get({ plain: true }))
    }
    return result
  }
}

module.exports = UserService
