var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tienda";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

/**
 * Aquí se importan todos los schemas
 */
var Usuario = require("./usuarios")