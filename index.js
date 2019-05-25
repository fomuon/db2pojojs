#!/usr/bin/env node

var commander = require('commander');
var mysqltable = require('./mysqltable');

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

commander
  .name('db2pojojs')
  .option('--mysql-host <mysql-host>', 'mysql host name')
  .option('--mysql-port <mysql-port>', 'mysql port. default 3306', 3306)
  .option('--mysql-user <mysql-user>', 'mysql user name')
  .option('--mysql-password <mysql-password>', 'mysql password')
  .option('--mysql-charset <mysql-charset>', 'mysql connection charset. default utf8', 'utf8')
  .option('--db-name <db-name>', 'db name to generate pojo class')
  .option('--table-names <table-names>', 'specific table names to generate pojo class. tab1,tab2... default all tables', commaSeparatedList)
  .option('--pojo-dir <pojo-dir>', 'pojo path to generate')
  .option('--pojo-package <package-name>', 'pojo package name')
  .option('--ddl-dir <ddl-dir>', 'ddl path to generate')
  .option('--dry', 'It will not create files, will only print to console')
  .action(function () {
    console.log("mysql-host : " + commander.mysqlHost);
    console.log("mysql-port : " + commander.mysqlPort);
    console.log("table-names : " + commander.tableNames);

    mysqltable.getTablesFromMysql(commander.mysqlHost, commander.mysqlPort, commander.dbName, commander.mysqlUser,
      commander.mysqlPassword, commander.mysqlCharset)
      .then((result) => {
        console.log('result ' + result);
      })
      .catch((err) => {
        console.error('error connecting: ' + err.stack);
      });
  })
  .parse(process.argv);


