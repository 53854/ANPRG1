const https = require("https");

// shuffels correct answer into incorrect answers array for further use
function parseTDBQuestion(q_json) {
    // replacing random incorrect answer with correct one
    let i = Math.round(Math.random() * q_json.incorrect_answers.length);
    let temp = q_json.incorrect_answers[i];
    q_json.incorrect_answers[i] = q_json.correct_answer;

    // readding incorrect answers
    q_json.incorrect_answers.push(temp);

    return q_json;
}

// Returns an array with "questions_amount" questions of category "category_ID" from TDB
function getQuiz(questions_amount = 10, category_ID = "") {

    let base_url = "https://opentdb.com/api.php?amount=";
    let amount = questions_amount.toString();
    let category = category_ID != "" ? category_ID.toString() : "";

    // construct url from openTDB parameters
    let url = base_url + amount + category + "&type=multiple";

    // Generate async promise for open tdb request
    return new Promise((resolve) => {
        https.get(url, res => {
            let responseString = "";
            res.on("data", data => {
                responseString += data;
            });
            res.on("end", () => {
                let parsed = JSON.parse(responseString);

                let questions = [];
                parsed.results.forEach(element => {
                    questions.push(parseTDBQuestion(element));
                });

                resolve(parsed.results);
            });
        });
    });
}

exports.getQuiz = getQuiz;