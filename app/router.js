'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/api/user', controller.user.index)
  router.post('/api/user/login', controller.user.login)
  router.post('/api/user/create', controller.user.create)
  router.del('/api/user/delete', controller.user.delete)
  router.put('/api/user/update', controller.user.update)
  router.get('/api/user/search', controller.user.search)
  router.get('/api/org', controller.org.index)
  router.get('/api/org/tree', controller.org.tree)
}
