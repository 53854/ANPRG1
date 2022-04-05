const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.urlencoded({ extended: true }));


const DATABASE = "prod.db";
const SQLITE3 = require("sqlite3").verbose();
const db = new SQLITE3.Database(DATABASE);

app.listen(3000, function () {
  console.log("Simps are donating on port 3000");
});

app.use(express.static(__dirname + "/views"));
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

app.get(["/", "/index"], function (req, res) {
  res.render("index");
});

app.post("/login", function (req, res) {

  var username = req.body.un;
  var password = req.body.pw;

  var succ = "Login failed";

  var querry = `SELECT * FROM users`
  db.all(querry, (err, rows) =>{
    rows.forEach(element => {
      
      if(element.name == username && element.password == password){
        succ = "Login successful<br/>welcome " + username;
      }
    })
    res.render("login", { welcome: succ });res.render("login", { welcome: succ });
  });
});