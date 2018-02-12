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
    done: {
      type: TINYINT(1),
      defaultValue: false
    },
    done_at: {
      type: DATE
    },
  })

  return Task
}
