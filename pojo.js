var fs = require('fs');

exports.generatePojo = function (tables, outputDir, packageName, dryRun) {
  for (tableName in tables) {
    console.log("tableName1 : " + tableName);
  }
};

exports.generateDll = function (tables, outputDir, dryRun) {
  for (tableName in tables) {
    if (dryRun) {
      var title = "==== Generate (" + tableName + " Script) ====";

      console.log(title);
      console.log(tables[tableName].script);
      console.log("---------------------------------------")
    } else {
      var filePath = outputDir + "/" + tableName + ".sql";
      fs.writeFile (filePath, tables[tableName].script, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }
};
