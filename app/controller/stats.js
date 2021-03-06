'use strict'

const Controller = require('../base/base_controller')

class StatsController extends Controller {
  async index() {
    this.ctx.body = 'This is stats api.'
  }

  async summary() {
    const { teamId, start, end, userId } = this.ctx.query
    let result
    if (start) {
      if (userId) {
        result = await this.service.stats.getTaskStatsWithRangeAndUserId(
          teamId,
          start,
          end,
          userId
        )
      } else {
        result = await this.service.stats.getTaskStatsWithRange(
          teamId,
          start,
          end
        )
      }
    } else {
      result = await this.service.stats.getTaskStats(teamId)
    }
    this.success(result)
  }

  async project() {
    const { teamId } = this.ctx.query
    const result = await this.service.stats.getTaskStatsGroupByProject(teamId)
    this.success(result)
  }

  async trend() {
    const { teamId, start, end } = this.ctx.query
    const result = await this.service.stats.trend(teamId, start, end)
    this.success(result)
  }

  async projectsWithTasks() {
    const { teamId, start, end } = this.ctx.query
    const result = await this.service.stats.findProjectsWithTasks(
      teamId,
      start,
      end
    )
    this.success(result)
  }
}

module.exports = StatsController
