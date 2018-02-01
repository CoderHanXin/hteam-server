'use strict'

module.exports = app => {
  const { STRING } = app.Sequelize

  const Group = app.model.define('group', {
    name: {
      type: STRING(20),
      allowNull: false
    }
  })

  Group.associate = function() {
    app.model.Group.belongsToMany(app.model.User, {
      through: 'r_group_user'
    })
  }
  return Group
}
