const Service = require('egg').Service
class UserService extends Service {
  async login(request) {
    const condition = { username: request.username }
    const result = this.app.mysql.get('user', condition)
    return result
  }

  async create(user) {
    user.createTime = this.app.mysql.literals.now
    const result = this.app.mysql.insert('user', user)
    return result
  }
}

module.exports = UserService
