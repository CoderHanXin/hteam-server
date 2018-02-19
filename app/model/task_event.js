'use strict'

module.exports = app => {
  const { STRING, DATE } = app.Sequelize

  const TaskEvent = app.model.define(
    'task_event',
    {
      type: {
        type: STRING(10),
        allowNull: false
      },
      event: {
        type: STRING(20),
        allowNull: false
      },
      deadline: {
        type: DATE
      },
    },
    {
      name: {
        singular: 'event',
        plural: 'events',
      },
      freezeTableName: true,
      tableName: 'task_event'
    }
  )

  TaskEvent.associate = function() {
    app.model.TaskEvent.belongsTo(app.model.User)
  }

  return TaskEvent
}
