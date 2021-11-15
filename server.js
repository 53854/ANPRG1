// TODO: Cleanup and sort 

// Load server modules
const {
    randomInt
} = require("crypto");
const request = require("request"); // TODO: replace request with got https://www.npmjs.com/package/got
const express = require("express");
const app = express();

// Make public directory available to the server
app.use(express.static(__dirname + "public"));

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
    console.log("Server is running on port 3000");
});

app.get(["/", "index", "landing"], function (req, res) {
    res.render("landing");
});

app.get(["question", "demo"], function (req, res) {
    // Setup Question page with TDB json

    res.render("question");
});

app.post("/answer", function (req, res) {
    // Answer response and handeling
});

// takes element from reults array of tdb json and returns a question object
// with all the answers and the correct answer
function getQuestion(q_json) {
    // create question holder object, adding an "all_answers" array
    let q = q_json;
    q.all_answers = q.incorrect_answers;

    // removing random incorrect answer from all_answers array
    let i = randomInt(0, q.all_answers.length);
    let temp = q.all_answers[i];

    // injecting correct answer into all_answers array
    // and pushing random incorrect answer back into array
    q.all_answers[i] = current_question.correct_answer;
    q.all_answers.push(temp);

    return q;
}

function getQuiz(questions_amount = 10, category_ID = "") {
   
    // construct url from openTDB parameters
    let base_url = "https://opentdb.com/api.php?amount="; 
    let amount = questions_amount.toString(); 
    let category = "";      
    if (category_ID != "") { category += "&category=" + category_ID.toString(); }
    let url = base_url + amount + category + "&type=multiple";

    // holder array for quizz
    let quiz = [];

    // TODO: use got for async request isntead 
    // request to openTDB.com
    request(url, {json: true}, (error, res, body) => {
        if (error) {
            return console.log(error);
        }
        if (!error && res.statusCode == 200) {
            for (let i = 0; i < body.results.length; i++) {
                quiz.push(getQuestion(body.results[i]));
            }
        }
    });

    // return filled quizz array
    return quiz;
}