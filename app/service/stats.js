'use strict'

const Service = require('egg').Service
const moment = require('moment')

class StatsService extends Service {
  async summary(teamId) {
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

    return { all, done, expired }
  }

  async trend(teamId, startDate, endDate) {
    const Op = this.app.model.Op
    const create = await this.app.model.Task.findAll({
      where: {
        team_id: teamId,
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: ['id', ['created_at', 'operateTime']]
    })

    const done = await this.app.model.Task.findAll({
      where: {
        team_id: teamId,
        done: 1,
        done_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: ['id', ['done_at', 'operateTime']]
    })

    return { create, done }
  }
}

module.exports = StatsService
