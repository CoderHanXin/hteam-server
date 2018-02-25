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
}

module.exports = StatsController
