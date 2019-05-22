var tablesFromMysql = require('mysql');

function getTablesFromMysql(host, port, db_name, user, password, charset) {
  var connection = tablesFromMysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: db_name,
    charset: charset
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);
  });
}

module.exports = getTablesFromMysql;
