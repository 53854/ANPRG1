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

});

app.get(["/", "index", "landing"], function (req, res) {
    res.render("landing");

    // on start quiz handle quiz generation and management
    quiz.getQuiz(10).then(function (quiz_set) {

        // use session cookie for question set storage?
        // or use a database?

        console.log(quiz_set)
    });
});

app.get(["question", "demo"], function (req, res) {
    // Setup Question page with TDB json

    res.render("question");
});

app.post("/answer", function (req, res) {
    // Answer response and handeling
});