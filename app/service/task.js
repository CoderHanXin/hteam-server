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

  async createComment(comment) {
    const result = await this.app.model.TaskComment.create(comment)
    return result.get({ plain: true })
  }

  async createEvent(event) {
    const result = await this.app.model.TaskEvent.create(event)
    return result.get({ plain: true })
  }

  async statsAll(teamId) {
    const all = await this.app.model.Task.count({
      where: {
        team_id: teamId
      }
    })
    const done = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 1
      }
    })
    const processing = all - done

    const now = new Date()
    const today = new Date(now.getFullYear, now.getMonth, now.getDate)
    const op = this.app.model.Op
    const expired = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0,
        deadline: {
          [op.lt]: today
        }
      }
    })

    return { all, done, processing, expired }
  }
}

module.exports = TaskService
