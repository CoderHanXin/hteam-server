'use strict'

module.exports = app => {
  const { STRING } = app.Sequelize

  const TaskComment = app.model.define(
    'task_comment',
    {
      content: {
        type: STRING(2000),
        allowNull: false
      }
    },
    {
      name: {
        singular: 'comment',
        plural: 'comments',
      },
      freezeTableName: true,
      tableName: 'task_comment'
    }
  )

  TaskComment.associate = function() {
    app.model.TaskComment.belongsTo(app.model.User)
  }

  return TaskComment
}
