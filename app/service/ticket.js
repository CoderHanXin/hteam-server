const Crypto = require('crypto')
const Service = require('egg').Service

class Ticket extends Service {
  create(act, payload, maxAge = 15 * 60 * 1000) {
    const Cipher = Crypto.createCipher('aes192', 'this_is_ticket_secret_key')
    const ticket = JSON.stringify({
      act,
      payload,
      maxAge,
      date: new Date()
    })
    return Cipher.update(ticket, 'utf8', 'hex') + Cipher.final('hex')
  }
  check(ticket, act, modifiedTime) {
    const Decipher = Crypto.createDecipher('aes192', 'this_is_ticket_secret_key')
    let rs
    try {
      rs = Decipher.update(ticket, 'hex', 'utf8') + Decipher.final('utf8')
      rs = JSON.parse(rs)
    } catch (err) {
      return { success: false, msg: '未知ticket' }
    }
    const expires = +new Date(rs.date) + rs.maxAge
    if (expires < Date.now()) {
      return { success: false, msg: 'ticket过期' }
    }
    if (act !== rs.act) {
      return { success: false, msg: 'ticket错误' }
    }
    if (modifiedTime && modifiedTime > new Date(rs.date)) {
      return { success: false, msg: 'ticket失效' }
    }
    return { success: true, data: rs }
  }
}

module.exports = Ticket
