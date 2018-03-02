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
            }
          ]
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
