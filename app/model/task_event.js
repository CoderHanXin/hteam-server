'use strict'

module.exports = app => {
  const { STRING } = app.Sequelize

  const TaskEvent = app.model.define(
    'task_event',
    {
      event: {
        type: STRING(20),
        allowNull: false
      },
      type: {
        type: STRING(10),
        allowNull: false
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
