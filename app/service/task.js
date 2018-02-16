'use strict'

const Service = require('egg').Service

class TaskService extends Service {
  /**
   * 根据projectId查询任务
   * @param   {Number}    projectId 项目id
   * @param   {Boolean}   done      是否完成
   * @return  {Object[]}  任务
   */
  async findByProjectId(projectId, done) {
    return this.app.model.Task.findAll({
      include: [
        {
          model: this.app.model.User,
          attributes: { exclude: ['username', 'password'] }
        }
      ],
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
      include: [
        {
          model: this.app.model.User,
          attributes: { exclude: ['username', 'password'] }
        }
      ],
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
}

module.exports = TaskService
