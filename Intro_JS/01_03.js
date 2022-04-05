// Aufg. 3
/** Arrays, Schleifen
 * a)   Definieren Sie eine Javascript-Datenstruktur, die für ein Game die Lebensenergie der Spieler speichert. 
 *      Definieren Sie dazu ein Array von Objekten. Jedes Objekt hat zwei Properties:
 *          -> Name des Spielers
 *          -> Lebensenergie des Spielers
 * b)   Schreiben Sie eine Schleife, die alle Namen aus dieser Datenstruktur ausliest und auf die Konsole ausgibt.
 * c)   Schreiben Sie eine Funktion, die den Namen des Spielers mit der höchsten Lebensenergie bestimmt und zurückgibt.
 */

const player1 = {name: "Max", life: 100};
const player2 = {name: "Manu", life: 80};
const player3 = {name: "Anna", life: 90};
const player4 = {name: "Chris", life: 40};
const player5 = {name: "Seb", life: 69};
const player6 = {name: "Jason", life: 55};
const player7 = {name: "Fred", life: 12};
const player8 = {name: "Zen", life: 50};

var players = [player1, player2, player3, player4, player5, player6, player7, player8];

function listPlayers() {
    for (var i = 0; i < players.length; i++) {
        console.log(players[i].name);
    }
}

function getPlayerWithHighestLife() {
    var highestLife = 0;
    var highestLifePlayer = "";
    for (var i = 0; i < players.length; i++) {
        if (players[i].life > highestLife) {
            highestLife = players[i].life;
            highestLifePlayer = players[i].name;
        }
    }
    return highestLifePlayer;
}

console.log("Players: ");
listPlayers();
console.log("Player with highest life: " + getPlayerWithHighestLife());