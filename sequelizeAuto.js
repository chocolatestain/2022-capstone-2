require('dotenv').config();
const SequelizeAuto = require('sequelize-auto')

const auto = new SequelizeAuto(
   process.env.DB_NAME,
   process.env.DB_USER,
   process.env.DB_PW, {
   host: process.env.DB_HOST,
   port: '3306',
   dialect: 'mysql'
})

auto.run()