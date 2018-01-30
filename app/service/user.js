const Service = require('egg').Service
const ROLE = require('../common/role')
class UserService extends Service {
  async findByUsername(username) {
    const result = await this.app.mysql.get('user', { username })
    return result
  }

  async create(user, teamId) {
    const conn = await this.app.mysql.beginTransaction()
    let result
    try {
      user.createTime = this.app.mysql.literals.now
      result = await this.app.mysql.insert('user', user)
      const r = {}
      r.teamId = teamId
      r.userId = result.insertId
      r.roleId = ROLE.MEMBER
      r.roleName = ROLE.MEMBER_TITLE
      await this.app.mysql.insert('r_team_user', r)
      await conn.commit()
    } catch (error) {
      await conn.rollback()
      throw error
    }
    return result
  }

  async delete(userId) {
    const result = await this.app.mysql.delete('user', { id: userId })
    return result
  }

  async update(user) {
    const result = await this.app.mysql.update('user', user)
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
