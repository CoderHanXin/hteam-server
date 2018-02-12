'use strict'

const Service = require('egg').Service

class TaskService extends Service {
  // async create(task) {
  //   task.createTime = this.app.mysql.literals.now
  //   const result = await this.app.mysql.insert('task', task)
  //   return result
  // }

  /**
   * 根据projectId查询任务
   * @param   {Number}    projectId 项目id
   * @param   {Boolean}   done      是否完成
   * @return  {Object[]}  任务
   */
  async findByProjectId(projectId, done) {
    return this.app.model.Task.findAll({
      where: { project_id: projectId, done }
    })
  }

  /**
   * 根据projectId查询任务
   * @param   {Number}    projectId 项目id
   * @return  {Object[]}  任务
   */
  async findAllByProjectId(projectId) {
    return this.app.model.Task.findAll({
      where: { project_id: projectId }
    })
  }

  async create(task) {
    const result = await this.app.model.Task.create(task)
    return result.get({ plain: true })
  }

  async update(task) {
    const result = await this.app.model.Task.update(task)
    return result
  }

  // async findByAssignee(assignee, type) {
  //   const values = []
  //   let _sql = 'select * from task '
  //   let _where = ' where assigneeId = ? '
  //   values.push(assignee)
  //   switch (Number(type)) {
  //     case taskSearch.TASK_SEARCH_ALL:
  //       break
  //     case taskSearch.TASK_SEARCH_COMPLETE:
  //       _where += ' and complete = ? '
  //       values.push(taskSearch.TASK_SEARCH_COMPLETE)
  //       break
  //     case taskSearch.TASK_SEARCH_UNCOMPLETE:
  //       _where += ' and complete = ? '
  //       values.push(taskSearch.TASK_SEARCH_UNCOMPLETE)
  //       break
  //     default:
  //       break
  //   }

  //   _sql += _where + ' order by id desc'
  //   const result = await this.app.mysql.query(_sql, values)
  //   return result
  // }
}

module.exports = TaskService
