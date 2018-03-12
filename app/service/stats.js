'use strict'

const Service = require('egg').Service
const moment = require('moment')

class StatsService extends Service {
  async getTaskStats(teamId) {
    const processing = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0
      }
    })
    const done = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 1
      }
    })

    const today = moment(moment().format('YYYY-MM-DD'))
      .utc()
      .toDate()
    const Op = this.app.model.Op
    const expired = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0,
        deadline: {
          [Op.lt]: today
        }
      }
    })
    return { processing, done, expired }
  }

  async getTaskStatsWithRange(teamId, start, end) {
    const Op = this.app.model.Op

    const today = moment(moment().format('YYYY-MM-DD')).utc()
    const endDate = moment(moment(end).format('YYYY-MM-DD')).utc()
    const diff = today.diff(endDate)
    const expiredDate =
      diff <= 0 ? today.toDate() : endDate.add(1, 'days').toDate()

    const processing = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0,
        [Op.and]: [
          {
            deadline: {
              [Op.gte]: start
            }
          },
          {
            deadline: {
              [Op.lt]: endDate.toDate()
            }
          }
        ]
      }
    })
    const done = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 1,
        [Op.and]: [
          {
            done_at: {
              [Op.gte]: start
            }
          },
          {
            done_at: {
              [Op.lt]: endDate.toDate()
            }
          }
        ]
      }
    })
    const expired = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0,
        [Op.and]: [
          {
            deadline: {
              [Op.gte]: start
            }
          },
          {
            deadline: {
              [Op.lt]: expiredDate
            }
          }
        ]
      }
    })
    return { processing, done, expired }
  }

  async getTaskStatsWithRangeAndUserId(teamId, start, end, userId) {
    const Op = this.app.model.Op

    const today = moment(moment().format('YYYY-MM-DD')).utc()
    const endDate = moment(moment(end).format('YYYY-MM-DD')).utc()
    const diff = today.diff(endDate)
    const expiredDate =
      diff <= 0 ? today.toDate() : endDate.add(1, 'days').toDate()

    const processing = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        user_id: userId,
        done: 0,
        [Op.and]: [
          {
            deadline: {
              [Op.gte]: start
            }
          },
          {
            deadline: {
              [Op.lt]: endDate.toDate()
            }
          }
        ]
      }
    })
    const done = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        user_id: userId,
        done: 1,
        [Op.and]: [
          {
            done_at: {
              [Op.gte]: start
            }
          },
          {
            done_at: {
              [Op.lt]: endDate.toDate()
            }
          }
        ]
      }
    })
    const expired = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        user_id: userId,
        done: 0,
        [Op.and]: [
          {
            deadline: {
              [Op.gte]: start
            }
          },
          {
            deadline: {
              [Op.lt]: expiredDate
            }
          }
        ]
      }
    })
    return { processing, done, expired }
  }

  async getTaskStatsGroupByProject(teamId) {
    const projects = await this.app.model.Project.findAll({
      attributes: ['id', 'name'],
      where: {
        team_id: teamId
      },
      raw: true
    })

    const processing = await this.app.model.Task.findAll({
      attributes: [
        ['project_id', 'projectId'],
        [this.app.model.fn('COUNT', 1), 'cnt']
      ],
      where: {
        team_id: teamId,
        done: 0
      },
      group: 'projectId',
      raw: true
    })
    const done = await this.app.model.Task.findAll({
      attributes: [
        ['project_id', 'projectId'],
        [this.app.model.fn('COUNT', 1), 'cnt']
      ],
      where: {
        team_id: teamId,
        done: 1
      },
      group: 'projectId',
      raw: true
    })

    const today = moment(moment().format('YYYY-MM-DD'))
      .utc()
      .toDate()
    const Op = this.app.model.Op
    const expired = await this.app.model.Task.findAll({
      attributes: [
        ['project_id', 'projectId'],
        [this.app.model.fn('COUNT', 1), 'cnt']
      ],
      where: {
        team_id: teamId,
        done: 0,
        deadline: {
          [Op.lt]: today
        }
      },
      group: 'projectId',
      raw: true
    })

    const list = []

    for (const project of projects) {
      const item = {}
      item.id = project.id
      item.name = project.name
      item.processing = 0
      item.done = 0
      item.expired = 0
      for (const p of processing) {
        if (project.id === p.projectId) {
          item.processing = p.cnt
          break
        }
      }
      for (const d of done) {
        if (project.id === d.projectId) {
          item.done = d.cnt
          break
        }
      }
      for (const e of expired) {
        if (project.id === e.projectId) {
          item.expired = e.cnt
          break
        }
      }
      const all = item.done + item.processing
      item.rate = all === 0 ? 0 : Number((item.done * 100 / all).toFixed())
      list.push(item)
    }

    return list
  }
  async trend(teamId, start, end) {
    const endDate = moment(moment(end).format('YYYY-MM-DD'))
      .utc()
      .add(1, 'days')
      .toDate()
    const Op = this.app.model.Op
    const create = await this.app.model.Task.findAll({
      where: {
        team_id: teamId,
        [Op.and]: [
          {
            created_at: {
              [Op.gte]: start
            }
          },
          {
            created_at: {
              [Op.lt]: endDate
            }
          }
        ]
      },
      attributes: ['id', ['created_at', 'operateTime']]
    })

    const done = await this.app.model.Task.findAll({
      where: {
        team_id: teamId,
        done: 1,
        [Op.and]: [
          {
            done_at: {
              [Op.gte]: start
            }
          },
          {
            done_at: {
              [Op.lt]: endDate
            }
          }
        ]
      },
      attributes: ['id', ['done_at', 'operateTime']]
    })

    return { create, done }
  }

  async findProjectsWithTasks(teamId, start, end) {
    const endDate = moment(moment(end).format('YYYY-MM-DD'))
      .utc()
      .add(1, 'days')
      .toDate()
    const Op = this.app.model.Op
    const result = await this.app.model.Project.findAll({
      include: [
        {
          model: this.app.model.Task,
          where: {
            [Op.or]: [
              {
                done: 0,
                [Op.and]: [
                  {
                    deadline: {
                      [Op.gte]: start
                    }
                  },
                  {
                    deadline: {
                      [Op.lt]: endDate
                    }
                  }
                ]
              },
              {
                done: 1,
                [Op.and]: [
                  {
                    done_at: {
                      [Op.gte]: start
                    }
                  },
                  {
                    done_at: {
                      [Op.lt]: endDate
                    }
                  }
                ]
              }
            ]
          },
          include: [
            {
              model: this.app.model.User,
              attributes: { exclude: ['username', 'password'] }
            },
            {
              model: this.app.model.Tag,
              attributes: ['id', 'name', 'color']
            }
          ]
        },
        {
          model: this.app.model.User,
          attributes: { exclude: ['username', 'password'] }
        }
      ],
      where: {
        team_id: teamId
      }
    })
    return result
  }
}

module.exports = StatsService
