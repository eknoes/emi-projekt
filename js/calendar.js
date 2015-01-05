/**
 * Autor: Carl-Lukas Pokoj
 * Dieses Script enthaelt Funktionen zur Erstellung und Manipulation des Kalenders
 */


var DAY_NAME = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");

var MONTH_NAME = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

var date;

var cal_sheet = new Array(35);

var text = "";

/*
 * Diese Funktion generiert alle Tage eines Monats bzw. einer Kalenderseite und gibt diese als Array zurueck
 */
function generateMonth(month, year) {

    //Initialisieren des 1. gewuenschten Monats month im Jahr year
    var dt = new Date(year, month, 1);
    var m = dt.getMonth();
    var ct = 0;

    //Ist der 1. eines Monats ein Montag, ansonsten gehe zum letzten Montag vor dem 1.
    while (dt.getDay() !== 1) {
        dt = new Date(year, month, ct);
        ct--;
    }

    //laufe ueber den Monat und speichere die einzelnen Daten in ein Array
    for (var i = 0; i < 35; i++) {
        cal_sheet[i] = dt.getDate();
        if (dt.getDate() === 25) {
            date = dt;
        }
        dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1);
    }

}

function nextMonth() {
    generateMonth(date.getMonth() + 1, date.getFullYear());
    write();
}

function prevMonth() {
    generateMonth(date.getMonth() - 1, date.getFullYear());
    write();
}

function write() {
    var count = 0;

    text = text + ' <table id="calendar"><tr><td class="calendar_head"><a class="calendar_link" href="javascript:prevMonth()"> &laquo;</a></td><td colspan=5 class="calendar_head_month" id="calendar_month">'
            + MONTH_NAME[date.getMonth()] + ' ' + date.getFullYear()
            + '</td><td class="calendar_head"><a class="calendar_link" href="javascript:nextMonth()"> &raquo;</a></td>'
            + '</tr><tr><td class="calendar_day">Mo</td><td class="calendar_day">Di</td><td class="calendar_day">Mi</td>'
            + '<td class="calendar_day">Do</td><td class="calendar_day">Fr</td><td class="calendar_day">Sa</td><td class="calendar_day">So</td></tr>';
    for (var i = 0; i < 5; i++) {
        text = text + '<tr>';
        for (var j = 0; j < 7; j++) {
            text = text + '<td class="calendar_entry" id="calendar_entry_1">' + cal_sheet[count] +
                    ' </div></td>';
            count++;
        }
        text = text + '</tr>';
    }
    text = text + '</table>';
    document.getElementById("kalender").innerHTML = text;
//    document.write(DAY_NAME[dt.getDay()] + ", der " + dt.getDate() + ". " + MONTH_NAME[dt.getMonth()] + " " + dt.getFullYear() + "<br>");
}