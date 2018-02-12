'use strict'

exports.mysql = {
  client: {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'hteam',
  },
  app: true,
  agent: false,
}

exports.sequelize = {
  dialect: 'mysql',
  database: 'hteam_test',
  host: '127.0.0.1',
  port: '3306',
  username: 'root',
  password: '123456'
}

exports.security = {
  domainWhiteList: [ 'http://localhost:9001' ],
}
