'use strict'

const Controller = require('../base/base_controller')
// const ERROR = require('../common/error')

class OrgController extends Controller {
  /**
   * default router
   */
  async index() {
    this.ctx.body = 'This is org api for HTeam.'
  }

  async tree() {
    const id = this.ctx.query.id
    if (id) {
      const result = await this.service.org.findTree(id)
      this.success(result)
    } else {
      this.ctx.status = 400
    }
  }
}

module.exports = OrgController
