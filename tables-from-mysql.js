var mysql = require('mysql');

var getTablesFromMysql = function (host, port, dbName, user, password, charset) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: dbName,
      charset: charset
    });

    connection.connect(function(err) {
      if (err) {
        reject(err);
      } else {
        var sql = "select `table_name` from information_schema.`tables` where table_schema = ?";

        connection.query(sql, [dbName], function (error, results) {
          if (error) {
            reject(error);
          } else {
            var tables = [];

            for (idx in results) {
              var tableName = results[idx]['table_name'];

              var sql = 'select `column_name`, data_type, is_nullable, character_maximum_length, column_type, column_comment from information_schema.`columns` where table_schema = ? and `table_name` = ?';

              var func = function (tableName) {
                return function (error, results) {
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

                  var sql = 'show create table ' + dbName + '.' + tableName;

                  connection.query(sql, null, function(error, results) {
                    console.log(results);

                    connection.end();
                  });

                  console.log(tableName + " - " + [ columns[0].column_name, columns[1].column_name, columns[2].column_name]);
                };
              };

              connection.query(sql, [dbName, tableName], func(tableName));

            }


            // resolve(results);
          }
        });
      }
    });
  });
};


module.exports = getTablesFromMysql;
