const Service = require('egg').Service

class ProjectService extends Service {
  async findByTeamId(teamId) {
    return this.app.model.Project.findAll({
      include: [
        {
          model: this.app.model.Task,
          where: { done: 0 },
          attributes: ['id'],
          required: false
        }
      ],
      where: { team_id: teamId }
    })
  }

  async findInfoAndUsersById(id) {
    const result = await this.app.model.Project.findOne({
      include: [{ model: this.app.model.User }],
      where: { id }
    })
    return result && result.get({ plain: true })
  }

  async create(teamId, project, users) {
    let plain
    let userList
    if (users) {
      userList = await this.app.model.User.findAll({
        where: {
          id: {
            $in: users
          }
        }
      })
    }
    project.team_id = teamId
    return this.app.model
      .transaction(t => {
        return this.app.model.Project.create(project, { transaction: t }).then(
          result => {
            plain = result.get({ plain: true })
            if (userList) {
              return result.addUsers(userList, { transaction: t })
            }
            return 1
          }
        )
      })
      .then(result => {
        return plain
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }

  async update(project, users) {
    let userList
    if (users) {
      userList = await this.app.model.User.findAll({
        where: {
          id: {
            $in: users
          }
        }
      })
    }
    const editProject = await this.app.model.Project.findById(project.id)
    return this.app.model
      .transaction(t => {
        return editProject.update(project, { transaction: t }).then(result => {
          return editProject.setUsers(userList, { transaction: t })
        })
      })
      .then(result => {
        return result
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }
}

module.exports = ProjectService
