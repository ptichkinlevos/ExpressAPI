const mysql = require('mysql2')

const dbConn = mysql.createConnection({
    host: "localhost",
    database: "videorental",
    user: "root",
    password: "12345"
})

dbConn.connect(function(error) {
    if (error) {
        throw error
    }
    console.log("База данных подключена!")
})

module.exports = dbConn;