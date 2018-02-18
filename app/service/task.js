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

  async findById(id) {
    return this.app.model.Task.findOne({
      include: [
        {
          model: this.app.model.User,
          attributes: { exclude: ['username', 'password'] }
        },
        {
          model: this.app.model.TaskComment,
          include: [
            {
              model: this.app.model.User,
              attributes: { exclude: ['username', 'password'] }
            }
          ]
        },
        {
          model: this.app.model.TaskEvent,
          include: [
            {
              model: this.app.model.User,
              attributes: { exclude: ['username', 'password'] }
            }
          ]
        }
      ],
      where: { id }
    })
  }

  async create(task) {
    const result = await this.app.model.Task.create(task)
    return result.get({ plain: true })
  }

  async update(task) {
    const result = await this.app.model.Task.update(task, {
      where: {
        id: task.id
      }
    })
    return result
  }

  async createComment(comment) {
    const result = await this.app.model.TaskComment.create(comment)
    return result.get({ plain: true })
  }

  async createEvent(event) {
    const result = await this.app.model.TaskEvent.create(event)
    return result.get({ plain: true })
  }
}

module.exports = TaskService
