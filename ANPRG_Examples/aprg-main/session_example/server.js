// Initialisierung Express
const express = require('express');
const app = express()

// Initialisierung body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Initialisierung express-session
const session = require('express-session');
app.use(session({
    secret: 'example',
    saveUninitialized: false,
    resave: false
}));

// Server starten
app.listen(3000, function () {
    console.log('listening on 3000')
});

// Sessionvariable setzen
app.post("/sessionSetzen", function (req, res) {
    // Wert aus Formular lesen
    const param_sessionValue1 = req.body.sessionValue1;
    const param_sessionValue2 = req.body.sessionValue2;
    const param_sessionValue3 = req.body.sessionValue3;

    // Sessionvariable setzen
    req.session.sessionValue1 = param_sessionValue1;
    req.session.sessionValue2 = param_sessionValue2;
    req.session.sessionValue3 = param_sessionValue3;

    // Weiterleiten
    res.redirect("/");
});

// Sessionvariable löschen
app.get("/sessionLoeschen", function (req, res) {
    req.session.destroy();

    // Weiterleiten
    res.redirect("/");
});

// Sessionvariable lesen
app.get("/", function (req, res) {
    if (!req.session.sessionValue1 &&!req.session.sessionValue2 &&!req.session.sessionValue3) {
        res.render("zeigesession", {
            message : "no value",
            sessionID : req.session.id
        });
    } else {
        res.render("zeigesession", {
            message : req.session.sessionValue1 + "\n" + req.session.sessionValue2 + "\n" + req.session.sessionValue3,
            sessionID : req.session.id
        });
    }
});