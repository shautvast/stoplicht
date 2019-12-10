const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const path = require('path')
var bcrypt = require('bcrypt');
const PORT = process.env.PORT || 5000

const logins = new Map();
logins.set("sander", "$2b$10$6P.6pE7M/6C9l/xXKDxJFucTL313GwESnhZ3aAqtVnv.ouLca/y6a");


express()
    .use(express.urlencoded())
    .use(express.static(path.join(__dirname, '/public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get("/data", (req, res) => sendData(req, res))
    .get('/', (req, res) => res.render('pages/index'))
    .post('/submit-form', (req, res) => appendToStorage(req, res))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

function appendToStorage(req, res) {
    if (req.body.username === '' || req.body.password === '') {
        res.render('pages/error');
    } else {
        if (!correctCredentials(req.body.username, req.body.password)) {
            res.render('pages/error');
        } else {
            fs.appendFile("dat", req.body.timestamp + ", " + req.body.username + ", " + req.body.emotion + "\n", err => {
                if (err) {
                    return console.log(err);
                }
            });
            res.render('pages/thanks');
        }
    }
}

function sendData(req, res) {
    fs.readFile("dat", (err, data) => {
        if (err) {
            console.error(err);
            res.render('pages/error');
        } else {
            return res.send(data);
        }
    });
}

function correctCredentials(username, password) {
    return bcrypt.compareSync(password, logins.get(username));
}
