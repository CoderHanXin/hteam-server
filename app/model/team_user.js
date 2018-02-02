'use strict'

module.exports = app => {
  const { STRING, TINYINT } = app.Sequelize

  const TeamUser = app.model.define(
    'team_user',
    {
      role_id: {
        type: TINYINT(2),
        allowNull: false
      },
      role_name: {
        type: STRING(10),
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      tableName: 'team_user'
    }
  )

  return TeamUser
}
