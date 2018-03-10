'use strict'

const Controller = require('../base/base_controller')
const qiniu = require('qiniu')

class CommonController extends Controller {
  // 生成七牛文件上传凭证
  async uploadToken() {
    const mac = new qiniu.auth.digest.Mac(
      this.config.qiniu.accessKey,
      this.config.qiniu.secretKey
    )
    const options = {
      scope: this.config.qiniu.bucket
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const token = putPolicy.uploadToken(mac)
    this.success(token)
  }
}

module.exports = CommonController
