const Service = require('egg').Service
class UserService extends Service {
  async login(request) {
    const condition = { username: request.username }
    const record = this.app.mysql.get('user', condition)
    return record
  }
}

module.exports = UserService
