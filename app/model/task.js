'use strict'

module.exports = app => {
  const { STRING, TINYINT, DATE } = app.Sequelize

  const Task = app.model.define('task', {
    title: {
      type: STRING(200),
      allowNull: false
    },
    desc: {
      type: STRING(1000)
    },
    deadline: {
      type: DATE
    },
    level: {
      type: TINYINT(1),
      defaultValue: 1
    },
    done: {
      type: TINYINT(1),
      defaultValue: 0
    },
    done_at: {
      type: DATE
    }
  })

  Task.associate = function() {
    app.model.Task.belongsTo(app.model.User)
    app.model.Task.belongsTo(app.model.Project)
    app.model.Task.belongsToMany(app.model.Tag, {
      through: 'task_tag'
    })
    app.model.Task.hasMany(app.model.TaskComment)
    app.model.Task.hasMany(app.model.TaskEvent)
  }

  return Task
}
