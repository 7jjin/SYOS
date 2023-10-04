require('dotenv').config();
const env = process.env;
 
const development = {
  username: 'mysql_prac',
  password: '12345678',
  database: 'kdt9',
  host: '127.0.0.1',
  dialect: 'mysql'
}

const production = {
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DATABASE,
  host: env.RDS_HOST,
  dialect: "mysql",
};
 

module.exports = { production, development };