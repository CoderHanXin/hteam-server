'use strict'

module.exports = app => {
  const { STRING } = app.Sequelize

  const Tag = app.model.define('tag', {
    name: {
      type: STRING(20),
      allowNull: false
    },
    color: {
      type: STRING(9)
    }
  })

  Tag.associate = function() {
    app.model.Tag.belongsToMany(app.model.Task, {
      through: 'task_tag'
    })
  }
  return Tag
}
