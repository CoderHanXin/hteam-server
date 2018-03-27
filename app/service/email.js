const nodemailer = require('nodemailer')
const Service = require('egg').Service

class Email extends Service {
  constructor(...args) {
    super(...args)
    this.transporter = nodemailer.createTransport(this.config.transporter)
  }
  sent(to, subject, html) {
    const { auth, appName } = this.config.transporter
    const mailOptions = {
      from: `${appName} <${auth.user}>`,
      to,
      subject,
      html
    }
    return this.transporter.sendMail(mailOptions).catch(error => {
      this.ctx.logger.info('Message %s sent error: %s', error)
      return error
    })
  }

  invite(ticket, email, user, team) {
    const url = `${this.config.clientRoot}/#/join/${ticket}`
    const a = `<a target="_blank" style="word-break:break-all" href="${url}">${url}</a>`
    const p = `<p style="margin:16px 0">${a}</p>`
    const html = `
      <strong>点击下方的链接，立即加入 ${user.name} 的团队「${team.name}」</strong>
      ${p}
    `
    return this.sent(email, `${user.name} 邀请你加入「${team.name}」团队`, html)
  }
}

module.exports = Email
