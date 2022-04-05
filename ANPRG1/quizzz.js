/* Helper functions for openTDB.com
 * converting json response to easily usable array of questions and answers
 * parsing question text by replacing special character codes with actual characters
 */

const https = require("https");

// List of special characters to format TDB response json
const chars = [
    ['"', /&quot;/g],
    ["'", /&apos;/g],
    ["'", /&#039;/g],
    ["&", /&amp;/g],
    ["<", /&lt;/g],
    [">", /&gt;/g],
    ["¡", /&iexcl;/g],
    ["¢", /&cent;/g],
    ["£", /&pound;/g],
    ["¤", /&curren;/g],
    ["¥", /&yen;/g],
    ["¦", /&brvbar;/g],
    ["§", /&sect;/g],
    ["¨", /&uml;/g],
    ["©", /&copy;/g],
    ["ª", /&ordf;/g],
    ["«", /&laquo;/g],
    ["¬", /&not;/g],
    ["­", /&shy;/g],
    ["®", /&reg;/g],
    ["¯", /&macr;/g],
    ["°", /&deg;/g],
    ["±", /&plusmn;/g],
    ["²", /&sup2;/g],
    ["³", /&sup3;/g],
    ["´", /&acute;/g],
    ["µ", /&micro;/g],
    ["¶", /&para;/g],
    ["·", /&middot;/g],
    ["¸", /&cedil;/g],
    ["¹", /&sup1;/g],
    ["º", /&ordm;/g],
    ["»", /&raquo;/g],
    ["¼", /&frac14;/g],
    ["½", /&frac12;/g],
    ["¾", /&frac34;/g],
    ["¿", /&iquest;/g],
    ["×", /&times;/g],
    ["÷", /&divide;/g],
    ["À", /&Agrave;/g],
    ["Á", /&Aacute;/g],
    ["Â", /&Acirc;/g],
    ["Ã", /&Atilde;/g],
    ["Ä", /&Auml;/g],
    ["Å", /&Aring;/g],
    ["Æ", /&AElig;/g],
    ["Ç", /&Ccedil;/g],
    ["È", /&Egrave;/g],
    ["É", /&Eacute;/g],
    ["Ê", /&Ecirc;/g],
    ["Ë", /&Euml;/g],
    ["Ì", /&Igrave;/g],
    ["Í", /&Iacute;/g],
    ["Î", /&Icirc;/g],
    ["Ï", /&Iuml;/g],
    ["Ð", /&ETH;/g],
    ["Ñ", /&Ntilde;/g],
    ["Ò", /&Ograve;/g],
    ["Ó", /&Oacute;/g],
    ["Ô", /&Ocirc;/g],
    ["Õ", /&Otilde;/g],
    ["Ö", /&Ouml;/g],
    ["Ø", /&Oslash;/g],
    ["Ù", /&Ugrave;/g],
    ["Ú", /&Uacute;/g],
    ["Û", /&Ucirc;/g],
    ["Ü", /&Uuml;/g],
    ["Ý", /&Yacute;/g],
    ["Þ", /&THORN;/g],
    ["ß", /&szlig;/g],
    ["à", /&agrave;/g],
    ["á", /&aacute;/g],
    ["â", /&acirc;/g],
    ["ã", /&atilde;/g],
    ["ä", /&auml;/g],
    ["å", /&aring;/g],
    ["æ", /&aelig;/g],
    ["ç", /&ccedil;/g],
    ["è", /&egrave;/g],
    ["é", /&eacute;/g],
    ["ê", /&ecirc;/g],
    ["ë", /&euml;/g],
    ["ì", /&igrave;/g],
    ["í", /&iacute;/g],
    ["î", /&icirc;/g],
    ["ï", /&iuml;/g],
    ["ð", /&eth;/g],
    ["ñ", /&ntilde;/g],
    ["ò", /&ograve;/g],
    ["ó", /&oacute;/g],
    ["ô", /&ocirc;/g],
    ["õ", /&otilde;/g],
    ["ö", /&ouml;/g],
    ["ø", /&oslash;/g],
    ["ù", /&ugrave;/g],
    ["ú", /&uacute;/g],
    ["û", /&ucirc;/g],
    ["ü", /&uuml;/g],
    ["ý", /&yacute;/g],
    ["þ", /&thorn;/g],
    ["ÿ", /&yuml;/g],
];

// helper function to clmap array index
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

// shuffels correct answer into incorrect answers array for further use
function parseTDBQuestion(q_json) {
    // fromat question text by replacing special character codes with actual characters
    for (var c = 0; c < chars.length; c++) {
        q_json.question = q_json.question.replace(chars[c][1], chars[c][0]);
    }

    // replacing random incorrect answer with correct one
    let randomIndex = Math.random() * q_json.incorrect_answers.length;
    let i = clamp(
        Math.round(randomIndex),
        0,
        q_json.incorrect_answers.length - 1
    );

    let temp = q_json.incorrect_answers[i];
    q_json.incorrect_answers[i] = q_json.correct_answer;

    // readding incorrect answers
    q_json.incorrect_answers.push(temp);

    q_json.incorrect_answers.forEach((a) => {
        for (var c = 0; c < chars.length; c++) {
            a = a.replace(chars[c][1], chars[c][0]);
        }
    });

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
        https.get(url, (res) => {
            let responseString = "";
            res.on("data", (data) => {
                responseString += data;
            });
            res.on("end", () => {
                let parsed = JSON.parse(responseString);

                let questions = [];
                parsed.results.forEach((element) => {
                    questions.push(parseTDBQuestion(element));
                });

                //console.log(parsed.results);

                resolve(parsed.results);
            });
        });
    });
}

exports.getQuiz = getQuiz;
