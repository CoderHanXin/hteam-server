'use strict'

exports.sequelize = {
  dialect: 'mysql',
  database: 'hteam',
  host: '127.0.0.1',
  port: '3306',
  username: 'root',
  password: '123456'
}

exports.security = {
  domainWhiteList: [ 'http://localhost:9001' ],
}
