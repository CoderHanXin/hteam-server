const Service = require('egg').Service
class UserService extends Service {
  async login(request) {
    const condition = { username: request.username }
    const result = await this.app.mysql.get('user', condition)
    return result
  }

  async create(user) {
    user.createTime = this.app.mysql.literals.now
    const result = await this.app.mysql.insert('user', user)
    return result
  }

  async delete(userId) {
    const result = await this.app.mysql.delete('user', { id: userId })
    return result
  }

  async update(user) {
    user.updateTime = this.app.mysql.literals.now
    const result = await this.app.mysql.update('user', user)
    return result
  }

  async search(orgId, name, status) {
    const wheres = []
    const values = []
    if (orgId) {
      wheres.push('orgId = ?')
      values.push(orgId)
    }
    if (name) {
      wheres.push('name like ?')
      values.push('%' + name + '%')
    }
    if (status) {
      wheres.push('status = ?')
      values.push(status)
    }

    let _where = ''
    if (wheres.length > 0) {
      _where = ' where ' + wheres.join(' and ')
    }
    const _sql = 'select id, username, name, phone, empNumber, orgId from user' + _where
    const result = await this.app.mysql.query(_sql, values)
    return result
  }
}

module.exports = UserService
