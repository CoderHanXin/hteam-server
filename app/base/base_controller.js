'use strict'
const Controller = require('egg').Controller
const ERROR = require('../common/error')

class BaseController extends Controller {
  success(result) {
    if (result) {
      this.ctx.body = { code: ERROR.CODE_OK, message: ERROR.MSG_OK, data: result }
    } else {
      this.ctx.body = { code: ERROR.CODE_OK, message: ERROR.MSG_OK }
    }
  }

  error(msg, errCode = ERROR.CODE_ERROR) {
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
