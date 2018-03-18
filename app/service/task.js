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
        },
        {
          model: this.app.model.Tag,
          attributes: ['id', 'name', 'color']
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
        },
        {
          model: this.app.model.Tag,
          attributes: ['id', 'name', 'color']
        }
      ],
      where: { project_id: projectId }
    })
  }

  async findByUserId(userId, done = 0) {
    const result = this.app.model.Task.findAll({
      include: [
        {
          model: this.app.model.Tag,
          attributes: ['id', 'name', 'color']
        }
      ],
      where: { user_id: userId, done }
    })
    return result
  }

  async findById(id) {
    return this.app.model.Task.findOne({
      include: [
        {
          model: this.app.model.User,
          attributes: { exclude: ['username', 'password'] }
        },
        {
          model: this.app.model.Tag,
          attributes: ['id', 'name', 'color']
        },
        {
          model: this.app.model.TaskComment,
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

  async findEventsById(id) {
    const result = await this.app.model.TaskEvent.findAll({
      include: [
        {
          model: this.app.model.User,
          attributes: { exclude: ['username', 'password'] }
        }
      ],
      where: { task_id: id },
      order: [['id', 'DESC']]
    })
    return result
  }

  async create(task, event) {
    let plain
    return this.app.model
      .transaction(t => {
        return this.app.model.Task.create(task, { transaction: t }).then(
          result => {
            plain = result.get({ plain: true })
            event.task_id = plain.id
            return this.app.model.TaskEvent.create(event, { transaction: t })
          }
        )
      })
      .then(result => {
        return plain
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }

  async update(task, event) {
    if (task.done) {
      task.done_at = this.app.model.fn('NOW')
    }
    return this.app.model
      .transaction(t => {
        return this.app.model.Task.update(task, {
          where: {
            id: task.id
          },
          transaction: t
        }).then(result => {
          return this.app.model.TaskEvent.create(event, { transaction: t })
        })
      })
      .then(result => {
        return result
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }

  async delete(id) {
    const result = await this.app.model.Task.destroy({
      where: { id }
    })
    return result
  }

  async addTag(taskId, tagId, event) {
    const task = await this.app.model.Task.findById(taskId)
    const tag = await this.app.model.Tag.findById(tagId)
    return this.app.model
      .transaction(t => {
        return task.addTag(tag, { transaction: t }).then(result => {
          return this.app.model.TaskEvent.create(event, { transaction: t })
        })
      })
      .then(result => {
        return result
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }

  async removeTag(taskId, tagId, event) {
    const task = await this.app.model.Task.findById(taskId)
    const tag = await this.app.model.Tag.findById(tagId)
    return this.app.model
      .transaction(t => {
        return task.removeTag(tag, { transaction: t }).then(result => {
          return this.app.model.TaskEvent.create(event, { transaction: t })
        })
      })
      .then(result => {
        return result
      })
      .catch(error => {
        console.log(error)
        throw error
      })
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
