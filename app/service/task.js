'use strict'

const Service = require('egg').Service

class TaskService extends Service {
  async create(task) {
    task.createTime = this.app.mysql.literals.now
    const result = await this.app.mysql.insert('task', task)
    return result
  }

  async update(task) {
    const result = await this.app.mysql.update('task', task)
    return result
  }
}

module.exports = TaskService
