'use strict'

const Service = require('egg').Service
const taskSearch = require('../common/task')

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

  async findByAssignee(assignee, type) {
    const values = []
    let _sql = 'select * from task '
    let _where = ' where assigneeId = ? '
    values.push(assignee)
    switch (Number(type)) {
      case taskSearch.TASK_SEARCH_ALL:
        break
      case taskSearch.TASK_SEARCH_COMPLETE:
        _where += ' and complete = ? '
        values.push(taskSearch.TASK_SEARCH_COMPLETE)
        break
      case taskSearch.TASK_SEARCH_UNCOMPLETE:
        _where += ' and complete = ? '
        values.push(taskSearch.TASK_SEARCH_UNCOMPLETE)
        break
      default:
        break
    }

    _sql += _where + ' order by id desc'
    const result = await this.app.mysql.query(_sql, values)
    return result
  }
}

module.exports = TaskService
