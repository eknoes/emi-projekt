/**
* Autor: Carl-Lukas Pokoj
* Dieses Script enthaelt Funktionen zur Erstellung und Manipulation des Kalenders
*/

var MONTH_NAME = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

var date;

var cal_sheet = new Array(42);

var text = "";

var rows = 5;

/*
 * Diese Funktion generiert alle Tage eines Monats bzw. einer Kalenderseite und gibt diese als Array zurueck
 */
function generateMonth(month, year) {

    //Initialisieren des 1. gewuenschten Monats month im Jahr year
    var dt = new Date(year, month, 1);
    var ct = 0;

    //Ist der 1. eines Monats ein Montag, ansonsten gehe zum letzten Montag vor dem 1.
    while (dt.getDay() !== 1) {
        dt = new Date(year, month, ct);
        ct--;
    }

    if ((dt.getDay() === 0) || (dt.getDay() === 5) || (dt.getDay() === 6)) {
        rows = 6;
    }

    //laufe ueber den Monat und speichere die einzelnen Daten in ein Array
    for (var i = 0; i < 42; i++) {
        cal_sheet[i] = dt;

        if (dt.getDate() === 15) {
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
    
    text = ' <table id="calendar"><tr><td class="calendar_head"><a class="calendar_link" href="javascript:prevMonth()"> &laquo;</a></td><td colspan=5 class="calendar_head_month" id="calendar_month">'
            + MONTH_NAME[date.getMonth()] + ' ' + date.getFullYear()
            + '</td><td class="calendar_head"><a class="calendar_link" href="javascript:nextMonth()"> &raquo;</a></td>'
            + '</tr><tr><td class="calendar_day">Mo</td><td class="calendar_day">Di</td><td class="calendar_day">Mi</td>'
            + '<td class="calendar_day">Do</td><td class="calendar_day">Fr</td><td class="calendar_day">Sa</td><td class="calendar_day">So</td></tr>';
            
    for (var i = 0; i < 6; i++) {
        text = text + '<tr>';
        for (var j = 0; j < 7; j++) {

            var circles = '<div class="circles">';
            var onDayEvents = EVENTS.onDay(cal_sheet[count]);
            if(onDayEvents) {
                for (var k = onDayEvents.length - 1; k >= 0; k--) {
                    if (onDayEvents[k].categories[0].toLowerCase() != "&ouml;ffentliches") {
                        circles = circles + '<div class="event_circle ' + onDayEvents[k].categories[0].toLowerCase() + '"  id="eventid-' + onDayEvents[k].id + '"></div>';
                    } else {
                        circles = circles + '<div class="event_circle oeffentliches"  id="eventid-' + onDayEvents[k].id + '"></div>';
                    }
                }
            }
            circles = circles + '</div>';

            var cssID = cal_sheet[count].getFullYear() + '-'
                        + ("0" + (cal_sheet[count].getMonth() + 1)).slice(-2) + '-' + ("0" + cal_sheet[count].getDate()).slice(-2);

            if (cal_sheet[count].getMonth() !== date.getMonth()) {
                text = text + '<td class="calendar_entry out_of_this_month" id="' + cssID + '">' + cal_sheet[count].getDate() + circles +
                        '</div></td>';
            } else {
                if (cal_sheet[count].getDate() === new Date().getDate() && cal_sheet[count].getMonth() === new Date().getMonth() && cal_sheet[count].getFullYear() === new Date().getFullYear()) {
                    text = text + '<td class="calendar_entry current_day" id="' + cssID + '">' + cal_sheet[count].getDate() +circles +
                            ' </div></td>';
                } else {
                    text = text + '<td class="calendar_entry" id="' + cssID + '">' + cal_sheet[count].getDate() +circles +
                            '</div></td>';
                }
            }

            count++;
        }
        text = text + '</tr>';
    }
    text = text + '</table>';
    $("div#kalender").html(text);
    
    reTooltipster();
    if(typeof reloadStuff == 'function') {
        reloadStuff();
    }
}



