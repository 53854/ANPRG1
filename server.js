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

// Initialize cookie-parser module
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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


// connect to heroku postgres database
const {
    Client
} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

// Start server
app.listen(process.env.PORT || 3000, function () {
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

    /* Old Sqlite 
    
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
    }); */


    client.query(`SELECT passw FROM accounts WHERE username='${username}'`, (err, rows) => {
        if (err) {
            throw err;
        }
        if (rows.length == 0) {
            res.render('login', {
                error: "We coundn't find this account. Please try again!"
            });
        } else {
            console.log(rows);
            if (pw == rows[0].passw) {
                req.session.loggedin = true;
                res.redirect("question");
            } else {
                res.render("login", {
                    error: "Username or passwort is not correct. Please try again!"
                });
            }
        }
        client.end();
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

        /*  Old Sqlite
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
                                //console.log(insertedID);
                                res.render("login");
                            });
                        } else {
                            res.render("register", {
                                error: "Incorrectlz entered password. Please try again!"
                            });
                        }
                    }
                });  
        */


        client.query(`SELECT passw FROM accounts WHERE username='${username}'`, (err, rows) => {
            if (rows.length != 0) {
                res.render("register", {
                    error: "This username has been used. Please choose another one!"
                });
            }
            if (rows.length == 0) {
                if (pw == rePW) {
                    const sql = `INSERT INTO accounts (username, passw) VALUES ('${username}', '${pw}')`;
                    client.query(sql, function (err) {
                        const insertedID = this.lastID;
                        //console.log(insertedID);
                        res.render("login");
                    });
                } else {
                    res.render("register", {
                        error: "Incorrectlz entered password. Please try again!"
                    });
                }
            }
            client.end();
        });
    }
});


app.get(["/start", "/startQuizz", "Start"], function (req, res) {

    quiz.getQuiz(10).then(function (quiz_set) {
        // loged in users are greeted by name
        let uName = req.session.username ? req.session.username : "Guest";

        // Generate questions for user
        var question_arr = [];
        quiz_set.forEach(e => {
            question_arr.push(e);
        });

        // initialize question index cookie
        req.session.question_index = 0;
        req.session.sessionScore = 0;
        req.session.currentQuestionSet = question_arr;

        res.render("question", {
            uName: uName,
            index: req.session.question_index,
            score: req.session.sessionScore,
            question_arr: req.session.currentQuestionSet,
            question: req.session.currentQuestionSet[req.session.question_index].question,
            answers: req.session.currentQuestionSet[req.session.question_index].incorrect_answers,
        });
    });
});


app.post("/answer", function (req, res) {
    // Question elements for answer eval and next question
    const index = parseInt(req.session.question_index);
    const question_arr = req.session.currentQuestionSet;
    const answer = req.body.answer;
    const correct_answer = question_arr[parseInt(req.session.question_index)].correct_answer;

    console.log("answer: " + answer + " | correct_answer: " + correct_answer);


    // keep user name (for greeting? 🖐)
    const uName = req.session.username ? req.session.username : "Guest";

    // Evaluate answer
    if (answer == correct_answer) req.session.sessionScore++;

    // Increment index before sending new question
    req.session.question_index++;

    // render final page if all questions have been answered
    if (req.session.question_index >= question_arr.length) {
        res.render("verdict", {
            index: parseInt(req.session.question_index),
            score: req.session.sessionScore
        });
    } else {
        res.render("question", {
            uName: uName,
            score: req.session.sessionScore,
            index: parseInt(req.session.question_index),
            question_arr: question_arr,
            question: question_arr[parseInt(req.session.question_index)].question,
            answers: question_arr[parseInt(req.session.question_index)].incorrect_answers,
        });
    }
});


// get req /question in landing page from guest
app.get(["/demo_question_list", "/demo"], function (req, res) {
    // Setup Question page with TDB json

    // on start quiz handle quiz generation and management
    quiz.getQuiz(10).then(function (quiz_set) {

        // use session cookie for question set storage?
        // or use a database?

        var question_arr = [];

        quiz_set.forEach(e => {
            question_arr.push(e.question);
        });


        //only logged in users maintain the same question set
        if (req.session.loggedin) {
            req.session.question_arr = req.session.question_arr ? req.session.question_arr : question_arr;
        }
        let question_set = req.session.question_arr ? req.session.question_arr : question_arr;

        /*  Enable this for cookie storage demo, that way Guest AND users maintain the same question set 
        // cookie storage for questions set
        let question_set = req.cookies.question_set ? req.cookies.question_set : question_arr;
        let question_set_length = question_set.length;
        let question_set_index = req.cookies.question_set_index ? req.cookies.question_set_index : 0;
        question_set_index ++; */

        // send cookies with response
        /*  const maxAge = 3600 * 1000; // one hour
         res.cookie('question_set', question_set, {"maxAge": maxAge});
         res.cookie('question_set_length', question_set_length, {"maxAge": maxAge});
         res.cookie('question_set_index', question_set_index, {"maxAge": maxAge}); */


        // loged in users are greeted by name
        let uName = req.session.username ? req.session.username : "Guest";

        //console.log(question_set);

        res.render("demo_question_list", {
            user: uName,
            arr: question_set,
        });
    });
});

app.get("/test", function (req, res) {
    //console.log("test button clicked");
    res.render("demo_question_list");
});

app.post("/answer", function (req, res) {
    // Answer response and handeling
});

// get req /questiondemo
app.get('/questiondemo', function (req, res) {
    res.render('questiondemo');
});