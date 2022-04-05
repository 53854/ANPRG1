// Aufg. 01
/** a) Aufgabe – Benutzerauthentifizierung
 ** Schreiben Sie eine Javascript-Tabelle, die Benutzernamen und zugehöriges Passwort verwaltet:
    | Benutzername  | Passwort
    | Alice         | §$Y45/912v
    | Bob           | secret
    | Carla         | 123
    | David         | divaD
 ** Erläuterung: "Tabelle" meint in diesem Fall ein Javascript Array von Objekten. 
    Jedes Objekt hat die zwei Felder zur Beschreibung des Benutzernamens und des Passworts.
 ** Schreiben Sie drei Funktionen zum Arbeiten mit dieser Tabelle:
 *      benutzerExistiert(benutzername): prüft, ob ein Benutzername in der Tabelle existiert        
        Liefert per return zurück:
            true: wenn der Benutzername existiert,
            false: wenn der Benutzername nicht existiert.
 *  anmeldungErfolgreich(benutzername, passwort): prüft, ob Benutzername und Passwort zusammenpassen. 
        Liefert per return zurück:
            true: wenn der Benutzername und Passwort passen,
            false: wenn der Benutzername und Passwort passen nicht.
 *  benutzerHinzufuegen(benutzername, passwort): fügt in die Tabelle einen neuen Benutzer mit Passwort ein. 
        Diese Funktion geht davon aus, dass der Benutzername bisher nicht vorhanden ist. 
        Keine Rückgabe mit return.
 ** Schreiben Sie ein Stück Quelltext, das diese Funktionen aufruft
 */

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var benutzer = [
    {
        name: "Alice",
        passwort: "§$Y45/912v",
    },
    {
        name: "Bob",
        passwort: "secret",
    },
    {
        name: "Carla",
        passwort: "123",
    },
    {
        name: "David",
        passwort: "divaD",
    },
];

function benutzerExistiert(benutzername) {
    for (var i = 0; i < benutzer.length; i++) {
        if (benutzername === benutzer[i].name) {
            return true;
        }
    }
    return false;
}

function anmeldungErfolgreich(benutzername, passwort) {
    for (var i = 0; i < benutzer.length; i++) {
        if (
            benutzername === benutzer[i].name &&
            passwort === benutzer[i].passwort
        ) {
            return true;
        }
    }
    return false;
}

function benutzerHinzufuegen(benutzername, passwort) {
    benutzer.push({
        name: benutzername,
        passwort: passwort,
    });
}

function login(benutzername) {
    rl.question("Passwort: ", function (passwort) {
        if (anmeldungErfolgreich(benutzername, passwort)) {
            exit(1);
        } else {
            exit();
        }
    });
}

function signup(benutzername) {
    rl.question("Neues Passwort: ", function (passwort) {
        benutzerHinzufuegen(benutzername, passwort);
        exit(2);
    });
}

function exit(exitcode = 0) {
    exitmsg = "";
    if (exitcode == 0) {
        exitmsg = "Anmeldung fehlgeschlagen";
    } else if (exitcode == 1) {
        exitmsg = "Anmeldung erfolgreich";
    } else if (exitcode == 2) {
        exitmsg = "Benutzer erfolgreich angelegt";
    }
    console.log(exitmsg);
    rl.close();
    process.exit();
}

function main() {
    rl.question("Benutzername: ", function (benutzername) {
        if (benutzerExistiert(benutzername)) {
            login(benutzername);
        } else {
            rl.question(
                `Nutzer existier nicht!\nNeuen Benutzer \"${benutzername}\" anlegen? (j/n): `,
                function (antwort) {
                    if (antwort === "j") {
                        signup(benutzername);
                    } else {
                        exit();
                    }
                }
            );
        }
    });
}

main();
