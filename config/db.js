const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha1234',
    database: 'DB_SPENDING_TOGETHER',
    multipleStatements: true
});

db.connect(function(err){
    if(!!err){
        console.log(err)
    }
});

module.exports = db;