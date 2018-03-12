'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.post('/api/account/login', controller.user.login)
  router.put('/api/account/password', controller.user.changePassword)

  router.get('/api/user', controller.user.index)
  router.post('/api/user', controller.user.create)
  router.del('/api/user/:id', controller.user.delete)
  router.put('/api/user/:id', controller.user.update)

  router.get('/api/team', controller.team.index)
  router.get('/api/team/:id', controller.team.show)
  router.post('/api/team/create', controller.team.create)
  router.put('/api/team/:id', controller.team.update)
  router.del('/api/team/:teamId/remove/:userId', controller.team.removeUser)

  router.get('/api/group', controller.group.index)
  router.post('/api/group', controller.group.create)
  router.del('/api/group/:id', controller.group.delete)
  router.put('/api/group/:id', controller.group.update)

  router.get('/api/project', controller.project.index)
  router.get('/api/project/:id', controller.project.show)
  router.post('/api/project', controller.project.create)
  router.put('/api/project/:id', controller.project.update)

  router.get('/api/task', controller.task.index)
  router.get('/api/task/:id', controller.task.show)
  router.post('/api/task', controller.task.create)
  router.put('/api/task/:id', controller.task.update)
  router.del('/api/task/:id', controller.task.delete)
  router.get('/api/task/:id/event', controller.task.showEvents)
  router.post('/api/task/:id/comment', controller.task.createComment)
  router.post('/api/task/:id/addTag', controller.task.addTag)
  router.post('/api/task/:id/removeTag', controller.task.removeTag)

  router.get('/api/tag', controller.tag.index)
  router.post('/api/tag', controller.tag.create)
  router.put('/api/tag/:id', controller.tag.update)
  router.del('/api/tag/:id', controller.tag.delete)

  router.get('/api/stats/summary', controller.stats.summary)
  router.get('/api/stats/project', controller.stats.project)
  router.get('/api/stats/trend', controller.stats.trend)
  router.get('/api/stats/pwt', controller.stats.projectsWithTasks)

  router.get('/api/upload/token', controller.common.uploadToken)
}
