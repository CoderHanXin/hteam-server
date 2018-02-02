'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/api/user', controller.user.index)
  router.post('/api/user/login', controller.user.login)
  router.post('/api/user', controller.user.create)
  router.del('/api/user/:id', controller.user.delete)
  router.put('/api/user/:id', controller.user.update)

  router.get('/api/team', controller.team.index)
  router.get('/api/team/:id', controller.team.show)
  router.post('/api/team/create', controller.team.create)
  router.del('/api/team/delete', controller.team.delete)
  router.put('/api/team/:id', controller.team.update)

  router.get('/api/group', controller.group.index)
  router.post('/api/group', controller.group.create)
  router.del('/api/group/delete', controller.group.delete)
  router.put('/api/group/:id', controller.group.update)

  router.get('/api/org', controller.org.index)
  router.get('/api/org/tree', controller.org.tree)

  router.get('/api/task', controller.task.index)
  router.get('/api/task/inbox', controller.task.inbox)
  router.post('/api/task/create', controller.task.create)
  router.put('/api/task/update', controller.task.update)
}
