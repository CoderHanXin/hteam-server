'use strict'

module.exports = app => {
  const { STRING, TINYINT } = app.Sequelize

  const Project = app.model.define('project', {
    name: {
      type: STRING(20),
      allowNull: false
    },
    desc: {
      type: STRING(200)
    },
    archived: {
      type: TINYINT(1),
      defaultValue: false
    }
  })

  Project.associate = function() {
    app.model.Project.belongsToMany(app.model.User, {
      through: 'project_user'
    })
  }
  return Project
}
