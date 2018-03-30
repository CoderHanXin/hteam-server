'use strict'

const Controller = require('../base/base_controller')
const ERROR = require('../common/error')
const md5 = require('blueimp-md5')
const jwt = require('jsonwebtoken')
const resolveAuthHeader = require('../utils/auth_header')

class UserController extends Controller {
  async index() {
    const { teamId, groupId, status } = this.ctx.query
    const result = {}
    if (teamId) {
      const users = await this.service.user.findByTeamId(teamId, status)
      const groups = await this.service.group.findByTeamId(teamId)
      result.users = users
      result.groups = groups
    } else {
      result.users = await this.service.user.findByGroupId(groupId, status)
    }
    this.success(result)
  }

  async register() {
    const { email, password, name } = this.ctx.request.body
    // 判断邮箱是否已被使用
    const result = await this.service.user.findByEmail(email)
    if (result) {
      this.error(ERROR.MSG_USER_CREATE_ERROR_EMAIL)
      return
    }
    // md5 格式化密码
    const md5Pass = md5(password, this.config.md5Key)
    // 创建用户
    const user = await this.service.user.create({
      email,
      password: md5Pass,
      name
    })
    // 判断是否有token，如果 tpye=wx，则绑定微信用户
    const token = resolveAuthHeader(this.ctx)
    if (token) {
      const decoded = jwt.verify(token, this.config.jwt.secret)
      if (decoded.type === 'wx') {
        user.wxuser_id = decoded.id
        await user.save()
        delete user.password
        const token = jwt.sign({ id: user.id }, this.config.jwt.secret, {
          expiresIn: '14d'
        })
        this.success({ user, token })
      } else {
        this.error('token error')
      }
    } else {
      const token = jwt.sign({ id: user.id }, this.config.jwt.secret, {
        expiresIn: '14d'
      })
      this.success({ user, token })
    }
  }

  /**
   * login
   * @param {string} email    邮箱
   * @param {string} password 密码
   * @description return {code:0, message:'', {user, token}}
   */
  async login() {
    const { email, password } = this.ctx.request.body
    const user = await this.service.user.loginByEmail(email)

    if (user) {
      if (user.password === md5(password, this.config.md5Key)) {
        delete user.password
        const token = jwt.sign({ id: user.id }, this.config.jwt.secret, {
          expiresIn: '14d'
        })
        this.success({ user, token })
      } else {
        this.error(ERROR.MSG_USER_LOGIN_FAILED)
      }
    } else {
      this.error(ERROR.MSG_USER_LOGIN_FAILED)
    }
  }

  async wxlogin() {
    const { user } = this.ctx.request.body
    const wxData = await this.service.wechat.getOpenidAndSessionKey(user.code)
    console.log('wxData', wxData.data)
    if (wxData.data.errcode) {
      this.error(wxData.data.errmsg, wxData.data.errcode)
      return
    }
    const result = await this.service.wxuser.findOrCreate(wxData.data.openid)
    const { wxuser, created } = result
    if (!created) {
      const user = await this.service.user.findByWxuserIdIncludeTeam(wxuser.id)
      if (user) {
        const token = jwt.sign({ id: user.id }, this.config.jwt.secret, {
          expiresIn: '14d'
        })
        this.success({ user, token })
        return
      }
    }
    const token = jwt.sign(
      { id: wxuser.id, type: 'wx' },
      this.config.jwt.secret,
      {
        expiresIn: '14d'
      }
    )
    this.success({ token })
  }

  async wxbind() {
    const { email, password } = this.ctx.request.body
    const user = await this.service.user.findByEmail(email)

    if (!user) {
      this.error(ERROR.MSG_USER_LOGIN_FAILED)
      return
    }
    if (user.password !== md5(password, this.config.md5Key)) {
      this.error(ERROR.MSG_USER_LOGIN_FAILED)
      return
    }

    const token = resolveAuthHeader(this.ctx)
    const decoded = jwt.verify(token, this.config.jwt.secret)
    if (decoded.type === 'wx') {
      user.wxuser_id = decoded.id
      await user.save()

      delete user.password
      const token = jwt.sign({ id: user.id }, this.config.jwt.secret, {
        expiresIn: '14d'
      })
      this.success({ user, token })
    } else {
      this.error('token error')
    }
  }

  /**
   * 根据token获取用户信息
   * @description return { user }
   */
  async showByToken() {
    const token = resolveAuthHeader(this.ctx)
    const decoded = jwt.verify(token, this.config.jwt.secret)
    if (decoded.type) {
      this.error('token error')
    } else {
      const user = await this.service.user.findByIdIncludeTeam(decoded.id)
      this.success({ user })
    }
  }

  async create() {
    const { user, teamId, role } = this.ctx.request.body
    // 判断邮箱是否已被使用
    let result = await this.service.user.findByEmail(user.email)
    if (result) {
      this.error(ERROR.MSG_USER_CREATE_ERROR_EMAIL)
      return
    }
    // md5 格式化密码
    user.password = md5(user.password, this.config.md5Key)
    // 创建用户
    result = await this.service.user.createTeamUser(user, teamId, role)
    // 返回user前删除密码字段
    delete result.password
    this.success(result)
  }

  async delete() {
    const id = this.ctx.params.id
    const result = await this.service.user.delete(id)
    const success = this.checkResult('delete', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_USER_DELETE_ERROR)
    }
  }

  async update() {
    const id = this.ctx.params.id
    const { user, teamId, role } = this.ctx.request.body
    user.id = id
    let result
    if (role) {
      result = await this.service.user.updateWithRole(user, teamId, role)
    } else {
      result = await this.service.user.update(user)
    }
    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_USER_UPDATE_ERROR)
    }
  }

  async changePassword() {
    const { id, oldPass, newPass, rePass } = this.ctx.request.body
    if (
      oldPass.trim() === '' ||
      newPass.trim() === '' ||
      rePass.trim() === ''
    ) {
      this.error(ERROR.MSG_USER_PASSWORD_ERROR_EMPTY)
      return
    }
    if (newPass !== rePass) {
      this.error(ERROR.MSG_USER_PASSWORD_ERROR_VERIFY)
      return
    }

    const user = await this.service.user.findById(id)

    if (user.password !== md5(oldPass, this.config.md5Key)) {
      this.error(ERROR.MSG_USER_PASSWORD_ERROR_WRONG)
      return
    }

    const result = await this.service.user.updatePassword(
      id,
      md5(newPass, this.config.md5Key)
    )

    const success = this.checkResult('update', result)
    if (success) {
      this.success()
    } else {
      this.error(ERROR.MSG_ERROR)
    }
  }

  async invite() {
    const { userId, teamId, email } = this.ctx.request.body

    const inviter = await this.service.user.findById(userId)
    const team = await this.service.team.findById(teamId)
    let invitee = await this.service.user.findByEmail(email)
    if (invitee) {
      console.log(invitee)
    } else {
      const user = {}
      user.email = email
      user.status = 0
      invitee = await this.service.user.create(user)
    }

    const ticket = this.service.ticket.create(
      'join',
      {
        userId: invitee.id,
        teamId
      },
      3 * 24 * 60 * 60 * 1000
    )

    const result = await this.service.email.invite(ticket, email, inviter, team)
    if (result && result.messageId) {
      this.success()
    } else {
      this.error('发送邮件失败，请重试')
    }
  }

  async joinCheck() {
    const ticket = this.ctx.params.ticket
    const decode = this.service.ticket.check(ticket, 'join')
    if (!decode.success) {
      this.error(decode.msg)
      return
    }
    const { userId, teamId } = decode.data.payload
    const result = await this.service.user.findByUserIdAndTeamId(userId, teamId)
    if (result) {
      this.error(ERROR.MSG_USER_JOIN_ERROR_JOINED)
      return
    }
    const user = await this.service.user.findById(userId)
    const team = await this.service.team.findById(teamId)
    delete user.password
    this.success({ user, team })
  }

  async join() {
    const { email, password, teamId, name } = this.ctx.request.body
    const invitee = await this.service.user.findByEmail(email)
    // 新用户需要输入名字、密码完成注册后加入;已注册用户需要验证密码后加入
    if (invitee.status === 1) {
      if (invitee.password !== md5(password, this.config.md5Key)) {
        this.error(ERROR.MSG_USER_LOGIN_FAILED)
        return
      }
      // 加入团队
      await this.service.user.joinTeam(invitee.id, teamId)
    } else {
      const user = {
        id: invitee.id,
        password: md5(password, this.config.md5Key),
        name,
        status: 1
      }
      // 设置名字、密码并加入团队
      await this.service.user.joinTeamAndUpdate(user, teamId)
    }
    this.success()
  }
}

module.exports = UserController
