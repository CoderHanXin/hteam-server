'use strict'

const Service = require('egg').Service

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

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    console.log(today)
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
}

module.exports = StatsService
