const Service = require('egg').Service

class OrgService extends Service {
  async findTree(id) {
    const node = await this.findFirst(id)
    node.children = await this.recursion(id)
    return node
  }

  async recursion(id) {
    const children = await this.findChildren(id)
    for (const item of children) {
      item.children = await this.recursion(item.id)
    }
    return children
  }

  async findChildren(id) {
    const _sql = 'select id, name as title from org where pid = ?'
    const result = await this.app.mysql.query(_sql, id)
    return result
  }

  async findFirst(id) {
    const _sql = 'select id, name as title from org where id = ?'
    const result = await this.app.mysql.query(_sql, id)
    return (result && result[0]) || null
  }
}

module.exports = OrgService
