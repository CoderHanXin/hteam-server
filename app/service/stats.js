'use strict'

const Service = require('egg').Service
// const momentTz = require('moment-timezone')
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
    console.log(moment(moment().format('YYYY-MM-DD')))
    console.log(moment(moment().format('YYYY-MM-DD')).utc().toDate())

    const today = moment(moment().format('YYYY-MM-DD')).utc().toDate()
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

    return { all, done, expired }
  }

  async taskTrend(teamId, startDate, endDate) {
    return 0
  }
}

module.exports = StatsService
