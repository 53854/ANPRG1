// TODO: Cleanup and sort 
const quiz = require("./quizzz");
const express = require("express");
const app = express();

// Initialize body and json parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Initialize express session module
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false
}));

// Initialize ejs module
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");


// Make public directory available to the server
app.use(express.static(__dirname + "views"));
app.use(express.static("public"));

// connect to the accounts database
const DATABASE = "accounts.db"
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(DATABASE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the accounts database.');
});

// Start server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});

app.get(["/", "/index", "/landing"], function (req, res) {
    res.render('landing');
});

// get req /login
app.get('/login', function (req, res) {
    res.render('login');
});
// get req /register
app.get('/register', function (req, res) {
    res.render('register');
});

// post req /logincheck and if successful, to question page, if not res.render('login', {error: "Login failed.."})
app.post("/logincheck", function (req, res) {
    const username = req.body.username;
    const pw = req.body.password;

    req.session.username = username;

    db.all(`SELECT passw FROM accounts WHERE username='${username}'`, (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length == 0) {
            res.render('login', {
                error: "We coundn't find this account. Please try again!"
            });
        } else {
            if (pw == rows[0].passw) {
                req.session.loggedin = true;
                res.redirect("question");
            } else {
                res.render("login", {
                    error: "Username or passwort is not correct. Please try again!"
                });
            }
        }
    });

});

// post req /signupcheck and if successful, back to log in, if not res.render('register', {error: "Account has been used.."})
app.post("/signupcheck", function (req, res) {
    const username = req.body.username;
    const pw = req.body.password;
    const rePW = req.body.repeat;
    if (username == "" || pw == "" || rePW == "") {
        res.render("register", {
            error: "Please fill in all fields!"
        });
    } else {
        db.all(`SELECT passw FROM accounts WHERE username='${username}'`, (err, rows) => {
            if (rows.length != 0) {
                res.render("register", {
                    error: "This username has been used. Please choose another one!"
                });
            }
            if (rows.length == 0) {
                if (pw == rePW) {
                    const sql = `INSERT INTO accounts (username, passw) VALUES ('${username}', '${pw}')`;
                    db.run(sql, function (err) {
                        const insertedID = this.lastID;
                        console.log(insertedID);
                        res.render("login");
                    });
                } else {
                    res.render("register", {
                        error: "Incorrectlz entered password. Please try again!"
                    });
                }
            }
        });
    }
});

// get req /question in landing page from guest
app.get(["/question", "/demo"], function (req, res) {
    // Setup Question page with TDB json

    // on start quiz handle quiz generation and management
    quiz.getQuiz(10).then(function (quiz_set) {

        // use session cookie for question set storage?
        // or use a database?

        var question_arr = [];

        quiz_set.forEach(e => {
            question_arr.push(e.question);
        });

        console.log(req.session.loggedin);

        if (req.session.loggedin) {
            req.session.question_arr = req.session.question_arr ? req.session.question_arr : question_arr;

            // Store question set in cookie
        }

        // replace with question set from cookie
        var question_set = req.session.question_arr ? req.session.question_arr : question_arr;

        var uName = req.session.username ? req.session.username : "Guest";

        res.render("question", {
            user: uName,
            arr: question_set
        });
    });
});

app.get("/test", function (req, res) {
    console.log("test button clicked");
    res.render("question");
});

app.post("/answer", function (req, res) {
    // Answer response and handeling
});