// TODO: Cleanup and sort 
const quiz = require("./quizzz");
const express = require("express");
const app = express();

// Make public directory available to the server
app.use(express.static(__dirname + "views"));

// Enable body and json parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Load and enable ejs module
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

// Start server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});

app.get(["/", "/index", "/landing"], function (req, res) {


    // on start quiz handle quiz generation and management
    quiz.getQuiz(10).then(function (quiz_set) {

        // use session cookie for question set storage?
        // or use a database?

        var question_arr = [];

        quiz_set.forEach(e => {
            question_arr.push(e.question);
        });

        res.render("landing", {
            arr: question_arr
        });
    });
});

// get req /login
app.get('/login', function (req, res) {
    //res.sendFile(__dirname + '/views/login.html');
    res.render('login');
});

// * Things to add:
// get req /questionstart in landing page from guest
// post req /logincheck and if successful, to question page, if not res.render('login', {error: "Login failed.."})
// get req /register
// post req /signupcheck and if successful, back to log in, if not res.render('register', {error: "Account has been used.."})

app.get(["/question", "/demo"], function (req, res) {
    // Setup Question page with TDB json

    res.render("question");
});

app.post("/answer", function (req, res) {
    // Answer response and handeling
});