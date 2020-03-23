const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'spectory',
  database: 'spectory',
  password: 'admin'
});
connection.connect();
module.exports = connection;