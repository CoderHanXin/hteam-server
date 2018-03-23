'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')

class TagController extends Controller {
  async index() {
    const teamId = this.ctx.query.teamId
    const result = await this.service.tag.findByTeamId(teamId)
    this.success(result)
  }

  async create() {
    const tag = this.ctx.request.body
    const result = await this.service.tag.create(tag)
    this.success(result)
  }

  async update() {
    const id = this.ctx.params.id
    const tag = this.ctx.request.body
    tag.id = id
    const result = await this.service.tag.update(tag)
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_TAG_UPDATE_ERROR)
    }
  }

  async delete() {
    const id = this.ctx.params.id
    const result = await this.service.tag.delete(id)
    const success = this.checkResult('delete', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_TAG_DELETE_ERROR)
    }
  }
}

module.exports = TagController
