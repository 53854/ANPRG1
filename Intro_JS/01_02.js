// Aufg. 02
/** Playlist
 * Sie wollen die Software für einen Web-Audioplayer programmieren. Dazu benötigen Sie eine Playlist mit
 * Musikstücken. Jedes Musikstück wird beschrieben durch:
 *     -> Name der Band (z.B. "Queen")
 *     -> Name des Musiktitels (z.B. "Bohemian Rapsody")
 *     -> Dauer (z.B. 5:36)
 * a) definieren ein Variable mit einem Objekt, das einen solchen Musiktitel repräsentiert,
 * b) definieren Sie ein Variable playlist mit einem Array solcher Objekte,
 * c) definieren Sie eine Funktion zeigeMusikstueck(playlist, titel), die zu einem gegebenem Titel das
 * entsprechende Objekt aus dem Array sucht und mit return zurückgibt,
 * d) definieren Sie eine Funktion getDauer(playlist, titel), die zu einem gegebenem Titel die entsprechende Dauer mit return zurückgibt,
 * e) definieren Sie eine Funktion berechneGesamtdauer(playlist) die die Gesamtdauer einer an sie übergebenen Playlist berechnet und mit return zurückgibt,
 * f) definieren Sie eine Funktion zeigeAlleMusikstuecke(playlist), die für eine gegebene Playlist alle
 * enthaltenen Musikstücke untereinander auf die Konsole ausgibt. Die Ausgabe für die einzelnen Stücke soll
 * etwas so aussehen (verwenden Sie dazu Template-Strings):
 *
 * Nr. 1: Queen, Bohemian Rapsody, Dauer 5:36
 * Nr. 2: ...
 */

const song = {
    artist: "Queen",
    titel: "Bohemian Rapsody",
    duration: "5:36",
};

var playlist = [{
        artist: "Queen",
        titel: "Bohemian Rapsody",
        duration: "5:36",
    },
    {
        artist: "test1",
        titel: "testies",
        duration: "4:20",
    },
    {
        artist: "test2",
        titel: "cats",
        duration: "0:69",
    },
];

function zeigeMusikstueck(playlist, titel) {
    return playlist[titel];
}

function getDauer(playlist, titel) {
    return playlist[titel].duration;
}

function berechneGesamtdauer(playlist) {
    var minutes = 0;
    var seconds = 0;

    for (var i = 0; i < playlist.length; i++) {
        var len = playlist[i].duration.split(":");
        minutes += parseInt(len[0]);
        seconds += parseInt(len[1]);
    }

    var mTotal = minutes + Math.floor(seconds / 60);
    var sTotal = seconds % 60;

    return mTotal + ":" + sTotal;
}

function zeigeAlleMusikstuecke(playlist) {
    for (var i = 0; i < playlist.length; i++) {
        console.log(
            "Nr. " +
            (i + 1) +
            ": " +
            playlist[i].artist +
            ", " +
            playlist[i].titel +
            ", " +
            playlist[i].duration
        );
    }
}

console.log(zeigeAlleMusikstuecke(playlist));