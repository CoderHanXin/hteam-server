'use strict'

module.exports = app => {
  const { STRING } = app.Sequelize

  const Wxuser = app.model.define(
    'wxuser',
    {
      openid: {
        type: STRING(30)
      }
    }
  )

  Wxuser.associate = function() {
    app.model.Wxuser.hasOne(app.model.User)
  }

  return Wxuser
}
