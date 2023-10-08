const mysql = require('mysql2');
const conn = mysql.createPool({
    host: "containers-us-west-164.railway.app",
    user: "root",
    password: "5HTCaHR4jAn29kXIzC1k",
    database: "railway",
    //charset: "utf8mb4",
    //timezone: "+07:00",
    port: "5657"
});

conn.getConnection( (err) => {
    if (err) throw err
    console.log('DB Connected');
});

module.exports = conn;