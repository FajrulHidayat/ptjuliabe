const Sequelize = require("sequelize")
const conn = require('./connection')

const db = {}
let sequelize

switch (process.env.NODE_ENV) {
  case 'production':
    sequelize = new Sequelize(
      conn.production.database,
      conn.production.username,
      conn.production.password, {
        host: conn.production.host,
        dialect: conn.production.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    );
    break
  case 'test':
    sequelize = new Sequelize(
      conn.test.database,
      conn.test.username,
      conn.test.password, {
        host: conn.test.host,
        dialect: conn.test.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    );
    break
  default:
    sequelize = new Sequelize(
      conn.development.database,
      conn.development.username,
      conn.development.password, {
        host: conn.development.host,
        dialect: conn.development.dialect,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
      },
    )
}

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db