'use strict'

module.exports = app => {
  const { STRING, TINYINT } = app.Sequelize

  const User = app.model.define(
    'user',
    {
      username: {
        type: STRING(20),
        allowNull: false
      },
      password: {
        type: STRING(32),
        validate: {
          len: [6, 32]
        }
      },
      name: {
        type: STRING(20)
      },
      email: {
        type: STRING(50),
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: STRING(20)
      },
      desc: {
        type: STRING(200)
      },
      status: {
        type: TINYINT(1),
        defaultValue: true
      }
    },
    {
      indexes: [
        {
          fields: ['name']
        },
        {
          fields: ['email']
        }
      ]
    }
  )

  User.associate = function() {
    app.model.User.belongsToMany(app.model.Team, {
      through: app.model.TeamUser
    })
    app.model.User.belongsToMany(app.model.Group, {
      through: 'r_group_user'
    })
    app.model.User.belongsToMany(app.model.Project, {
      through: 'r_project_user'
    })
  }

  return User
}
