import { error } from 'util'
;('use strict')

const Controller = require('egg').Controller

class BaseController extends Controller {
  success(result) {
    this.ctx.body = { code: 0, message: '成功', data: result }
  }

  error(errCode, msg) {
    this.ctx.body = { code: errCode, message: msg }
  }

  checkResult(type, result) {
    let success = true
    switch (type) {
      case 'create':
      case 'update':
        if (result.affectedRows !== 1) {
          success = false
        }
        break
      case 'delete':
        if (result.affectedRows < 1) {
          success = false
        }
        break
      default:
        break
    }
    return success
  }
}

module.exports = BaseController
