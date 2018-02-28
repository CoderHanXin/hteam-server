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

  async getTaskStats(teamId, start, end) {
    const Op = this.app.model.Op

    const processing = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0,
        deadline: {
          [Op.between]: [start, end]
        }
      }
    })

    const done = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 1,
        done_at: {
          [Op.between]: [start, end]
        }
      }
    })

    const today = moment(moment().format('YYYY-MM-DD')).utc()
    const endDate = moment(moment(end).format('YYYY-MM-DD'))
    console.log('today')
    console.log(today)
    console.log('endDate')
    console.log(endDate)
    const diff = today.diff(endDate)
    const expiredTime = diff < 0 ? today.subtract(1, 'seconds').toDate() : endDate.subtract(1, 'seconds').toDate()
    const expired = await this.app.model.Task.count({
      where: {
        team_id: teamId,
        done: 0,
        deadline: {
          [Op.between]: [start, expiredTime]
        }
      }
    })
    return { processing, done, expired }
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
