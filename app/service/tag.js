'use strict'

const Service = require('egg').Service

class TagService extends Service {
  async findByTeamId(teamId) {
    return this.app.model.Tag.findAll({
      where: {
        team_id: teamId
      }
    })
  }
  async create(tag) {
    const result = await this.app.model.Tag.create(tag)
    return result
  }

  async update(tag) {
    const result = await this.app.model.Tag.update(tag, {
      where: { id: tag.id }
    })
    return result
  }

  async delete(id) {
    const result = await this.app.model.Tag.destroy({
      where: { id }
    })
    return result
  }
}

module.exports = TagService
