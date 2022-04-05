// Aufg. 01
/** Funktion
 * Definieren Sie eine Funktion, die zu einem gegebenen Brutto-Preis die Mehrwertsteuer berechnet. 
 * Folgender Code soll zur Ausgabe: 0.38 führen:
 * const preis = 2.00;
 * const mehrwertsteuer = 19;
 * console.log(berechneMehrwertsteuer(mehrwertsteuer, preis));
 */
const preis = 2.00;
const mehrwertsteuer = 19;
function berechneMehrwertsteuer(cost, vatpercent) {
    return cost * (vatpercent / 100);   
}
console.log(berechneMehrwertsteuer(mehrwertsteuer, preis));

