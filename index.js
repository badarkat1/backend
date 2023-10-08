const express = require("express");
const port=process.env.PORT || 3003;
const mysql = require("mysql2");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

const conn = require('./config/db.js');

//API middlewares
app.use(cors({
    origin: '*',
}))
app.use(express.json()); //to accept data in json format 
app.use(express.urlencoded()); //to decode the data send through html form
app.use(express.static('frend')); //to serve our public folder as static folder
app.use(bodyParser.json());

//API Routes


// REGISTER
app.post('/formpostr', async function (req,res) {
    await console.log(req.body);
    const param = req.body;
    const name = param.name;
    const phone = param.phone;
    const email = param.email;
    const password = param.password;
    const now = new Date();

    const queryStr = "INSERT INTO regis (name, phone, email, password, created_at) VALUES (?, ?, ?, ?, ?)";
    const values = [name, phone, email, password, now]

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message" : err.sqlMessage,
                "data" : null
            });
        } else {
            res.status(200).json({
                "success" : true,
                "message" : "sukses menambah akun (register)",
                "data" : results
            });
        }
    })
})

// LOGIN
app.post('/formpostl', async function (req, res){
    await console.log(req.body);
    const param = req.body;
    const email = param.email;
    const password = param.password;

    const queryLgn = "SELECT email, password FROM regis WHERE email = ?";
    const values = [email]

    conn.query(queryLgn, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message" : err.sqlMessage,
                "data" : null
            });
        } else {
            if (results.length > 0 && password == results[0].password) {
                res.status(200).json({
                    "success" : true,
                    "message" : "Login Sukses",
                    "data" : results
                });
                console.log('berhasil login')
            }
            else {
                res.status(500).json({
                    "success": false,
                    "message" : "password salah",
                    "data" : null
                });
                console.log('password salah');
            }
        }
    })
})

// CEK RESI BY NOMOR RESI
app.post('/get-resi', async function (req, res) {
    await console.log(req.body.resi);
    const param = req.body;
    const resi = param.resi;

    const queryRs = "SELECT resi, penerima, status FROM resi_s WHERE resi = ?";
    const values = [resi]
    
    conn.query(queryRs, values, (err, results) => {
        if (err) {
            console.log(err);
            res.error(err.sqlMessage, res);
        } else {
            res.status(200).json({
                "success" : true,
                "message" : "sukses menampilkan resi",
                "data" : results
            });
        }
    });
})

// semua resi
app.get('/semua-resi', async function(req, res){
    await console.log(req.body.resi);

    const queryStr = "SELECT resi, penerima, status FROM resi_s";
    conn.query(queryStr, (err, results) => {
        if (err){
            console.log(err);
            res.error(err.sqlMessage, res);
        }
        else{
            res.status(200).json({
                "success": true,
                "message": "Sukses menampilkan resi",
                "data": results
            });
        }
    });
})

// CEK ONGKIR
app.post('/formpostt', async function (req,res) {
    await console.log(req.body);
    const param = req.body;
    const asal = param.asal;
    const tujuan = param.tujuan;
    const berat = param.berat;

    const queryRs = "SELECT asal, tujuan, ck_tarif*?, su_tarif*? FROM tarifs WHERE asal = ? AND tujuan = ?";
    const values = [berat, berat, asal, tujuan]
    
    conn.query(queryRs, values, (err, results) => {
        if (err) {
            console.log(err);
            res.error(err.sqlMessage, res);
        } else {
            res.status(200).json({
                "success" : true,
                "message" : "sukses menampilkan ongkir",
                "data" : results
            });
        }
    });

})

//


app.post('/store-resi', function (req, res) {
    console.log(req.body);
    const param = req.body;
    const resi = param.resi;
    const penerima = param.penerima;
    const status = param.status;
    const now = new Date();

    const queryStr = "INSERT INTO resi_s (resi, penerima, status, created_at) VALUES (?, ?, ?, ?)";
    const values = [resi, penerima, status, now];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message" : err.sqlMessage,
                "data" : null
            });
        } else {
            res.status(200).json({
                "success" : true,
                "message" : "sukses menyimpan data",
                "data" : results
            });
        }
    })
})

app.get('/get-resi-by-resi', function (req, res) {
    const param = req.query;
    const resi = param.resi;

    const queryStr = "SELECT * FROM resi_s WHERE deleted_at is NULL AND resi = ?";
    const values = [resi];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message" : err.sqlMessage,
                "data" : null
            });
        } else {
            res.status(200).json({
                "success" : true,
                "message" : "sukses menampilkan data",
                "data" : results
            });
        }
    })
})

app.post('/update-resi', function (req, res) {
    const param = req.body;
    const id = param.id;
    const resi = param.resi;
    const penerima = param.penerima;
    const status = param.status;

    const queryStr = "UPDATE resi_s SET resi = ?, penerima = ?, status = ? WHERE id = ? AND deleted_at is NULL";
    const values = [resi, penerima, status, id];

    conn.query(queryStr, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                "success": false,
                "message" : err.sqlMessage,
                "data" : null
            });
        } else {
            res.status(200).json({
                "success" : true,
                "message" : "sukses menampilkan data",
                "data" : results
            });
        }
    })
})

app.listen(port, ()=>{
    console.log("server started on port 3003");
});