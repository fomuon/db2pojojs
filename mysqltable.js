var mysql = require('mysql');

exports.getTablesFromMysql = function (host, port, dbName, user, password, charset) {

  return new Promise( (resolve, reject) => {

    createConnection(host, port, dbName, user, password, charset)
      .then((connection) => {
        return getTableNames(connection, dbName);
      })
      .then(([connection, dbName, tables]) => {
        return getColumns(connection, dbName, tables);
      })
      .then(([connection, dbName, tables]) => {
        return getCreateTableScript(connection, dbName, tables);
      })
      .then(([connection, dbName, tables]) => {
        connection.end();
        resolve(tables);
      })
      .catch(error =>{
        reject(error);
      })

  });
};

function createConnection(host, port, dbName, user, password, charset) {

  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: dbName,
      charset: charset
    });

    connection.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection, dbName);
      }
    });
  });
}

function getTableNames(connection, dbName) {

  return new Promise((resolve, reject) => {
    var sql = "select `table_name` from information_schema.`tables` where table_schema = ?";

    connection.query(sql, [dbName], (error, results) => {
      if (error) {
        reject(error);
      } else {
        var tables = {};

        for (idx in results) {
          var tableName = results[idx]['table_name'];

          tables[tableName] = {'columns': null, 'script': null};
        }

        resolve([connection, dbName, tables]);
      }
    });
  });
}

function getColumns(connection, dbName, tables) {

  return new Promise((resolve, reject) => {
    var sql = 'select `column_name`, data_type, is_nullable, character_maximum_length, column_type, column_comment from information_schema.`columns` where table_schema = ? and `table_name` = ?';

    Object.keys(tables).forEach((tableName, i, arr) => {

      connection.query(sql, [dbName, tableName], (error, results) => {
        if (error) {
          reject(error);
        } else {
          var columns = [];

          for (idx in results) {
            var column = {
              column_name: results[idx]['column_name'],
              data_type: results[idx]['data_type'],
              nullable: results[idx]['is_nullable'] === 'YES',
              character_maximum_length: results[idx]['character_maximum_length'],
              column_type: results[idx]['column_type'],
              column_comment: results[idx]['column_comment']
            };

            columns.push(column);
          }

          tables[tableName].columns = columns;

          if (i === arr.length - 1) {
            resolve([connection, dbName, tables]);
          }
        }
      });
    });
  });
}

function getCreateTableScript(connection, dbName, tables) {

  return new Promise((resolve, reject) => {

    Object.keys(tables).forEach((tableName, i, arr) => {

      var sql = 'show create table ' + dbName + '.' + tableName;

      connection.query(sql, null, (error, results) => {
        if (error) {
          reject(error);
        } else {
          tables[tableName].script = results[0]['Create Table'];

          if (i === arr.length - 1) {
            resolve([connection, dbName, tables]);
          }
        }
      });

    });
  });
}
