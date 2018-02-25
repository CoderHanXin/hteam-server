'use strict'

module.exports = app => {
  const { STRING } = app.Sequelize

  const Team = app.model.define('team', {
    name: {
      type: STRING(20),
      allowNull: false
    }
  })

  Team.associate = function() {
    app.model.Team.belongsToMany(app.model.User, {
      through: app.model.TeamUser
    })
    app.model.Team.hasMany(app.model.Group)
    app.model.Team.hasMany(app.model.Project)
    app.model.Team.hasMany(app.model.Task)
  }
  return Team
}
