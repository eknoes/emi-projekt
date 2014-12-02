/**
 * Autor: Carl-Lukas Pokoj
 * Dieses Script enthaelt Funktionen zur Erstellung und Manipulation des Kalenders
 */


var DAY_NAME = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");

var MONTH_NAME = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

var dt;

/*
 * Diese Funktion generiert alle Tage eines Monats bzw. einer Kalenderseite und gibt diese als Array zurueck
 */
function generateMonth(month, year) {

    //Initialisieren des aktuellen gewuenschten Datums
    dt = new Date(year, month, 1);

    var ct = 0;

    //Ist der 1. eines Monats ein Montag, ansonsten gehe zum letzten Montag vor dem 1.
    while (dt.getDay() !== 1) {
        dt = new Date(year, month, ct);
        ct--;
    }

    //laufe ueber den Monat und speichere die einzelnen Daten in ein Array
    for (var i = 0; i < 35; i++) {
        document.write(DAY_NAME[dt.getDay()] + ", der " + dt.getDate() + ". " + MONTH_NAME[dt.getMonth()] + " " + dt.getFullYear() + "<br>");
        dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1);
    }
}