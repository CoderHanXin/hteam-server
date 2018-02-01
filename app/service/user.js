const Service = require('egg').Service
const ROLE = require('../common/role')
class UserService extends Service {
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
        console.log(result)
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
    const result = await this.app.model.User.update(user)
    return result
  }

  async findByParamsAndGroupId(params) {
    return 0
  }

  async findByParamsAndTeamId(params) {
    const wheres = []
    const values = []

    let _sql = 'select u.id, u.username, u.name, u.phone, u.email, u.desc,'
    _sql += ' r.roleId, r.roleName, r.groups '
    _sql += ' from user u, '
    _sql += ' (select * from r_team_user where teamId = ?) r '
    values.push(params.teamId)

    if (params.name) {
      wheres.push('name like ?')
      values.push('%' + params.name + '%')
    }
    if (params.status) {
      wheres.push('status = ?')
      values.push(params.status)
    }

    let _where = ' where u.id = r.userId '
    if (wheres.length > 0) {
      _where += ' and ' + wheres.join(' and ')
    }
    _sql += _where
    const result = await this.app.mysql.query(_sql, values)
    return result
  }
}

module.exports = UserService
