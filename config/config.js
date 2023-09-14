require('dotenv').config();
const env = process.env;
 
const production = {
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  database: env.RDS_DATABASE,
  host: env.RDS_HOST,
  dialect: "mysql",
};
 

module.exports = { production, test };