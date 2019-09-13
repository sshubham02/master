const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ptspl',
    password : 'Tech@2019',
    database : 'apiauthentication'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;