'use strict'

const Controller = require('../base/base_controller')

class StatsController extends Controller {
  async index() {
    this.ctx.body = 'This is stats api.'
  }

  async summary() {
    const teamId = this.ctx.query.teamId
    const result = await this.service.stats.summary(teamId)
    this.success(result)
  }

  async trend() {
    const { teamId, start, end } = this.ctx.query
    const result = await this.service.stats.trend(teamId, start, end)
    this.success(result)
  }

  async taskStats() {
    const { teamId, start, end } = this.ctx.query
    const result = await this.service.stats.getTaskStats(teamId, start, end)
    this.success(result)
  }
}

module.exports = StatsController
