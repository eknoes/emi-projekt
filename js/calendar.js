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
	setTimeout("write()",500);
	$('#kalender').animate({'opacity': '0'}, 500);
    $('#kalender').animate({'opacity': '1'}, 500);
}

function prevMonth() {
    generateMonth(date.getMonth() - 1, date.getFullYear());
    setTimeout("write()",500);
	$('#kalender').animate({'opacity': '0'}, 500);
    $('#kalender').animate({'opacity': '1'}, 500);
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

            /* Circles werden generiert */
            var categories = ["kultur", "musik", "oeffentliches", "soiree", "bildung", "sonstige"];
            var onDayEvents = EVENTS.onDay(cal_sheet[count]); 
            if(onDayEvents.length > 0) { // Falls es Events an diesem Tag gibt, wird ein circles DIV gestartet und gefuellt
                console.log(onDayEvents);
                var circles = '<div class="circles">';
                for (var k = categories.length - 1; k >= 0; k--) { //Da pro Kategorie nur ein Circle enstehen soll, und nicht pro event
                    var categoryEvents = EVENTS.onDay(cal_sheet[count], categories[k]);
                    for (var l = categoryEvents.length - 1; l >= 0; l--) { //Danach werden alle Events, die an diesem Tag in der Kategorie stattfinden, in einen circle gepackt
                        if (l == 0 && l == categoryEvents.length - 1) {
                            circles = circles + '<div class="event_circle ' + categories[k] + '" id="eventids-' + categoryEvents[l].id + '"></div>';
                        } else if(l == categoryEvents.length - 1) {
                            circles = circles + '<div class="event_circle ' + categories[k] + '" id="eventids-' + categoryEvents[l].id;
                        } else if (l == 0) {
                            circles = circles + '-' + categoryEvents[l].id + '"></div>';
                        } else if (l != 0 && l != categoryEvents.length - 1) {
                            circles = circles + '-' + categoryEvents[l].id;
                        }
                    }

                }
                var noEventCSS = "";
                circles = circles + '</div>';
            } else {
                var noEventCSS = "no_event";
                var circles = "";
            }


            var cssID = cal_sheet[count].getFullYear() + '-'
                        + ("0" + (cal_sheet[count].getMonth() + 1)).slice(-2) + '-' + ("0" + cal_sheet[count].getDate()).slice(-2);

            if (cal_sheet[count].getMonth() !== date.getMonth()) {
                text = text + '<td class="calendar_entry ' + noEventCSS + ' out_of_this_month" id="' + cssID + '">' + cal_sheet[count].getDate() + circles +
                        '</div></td>';
            } else {
                if (cal_sheet[count].getDate() === new Date().getDate() && cal_sheet[count].getMonth() === new Date().getMonth() && cal_sheet[count].getFullYear() === new Date().getFullYear()) {
                    text = text + '<td class="calendar_entry ' + noEventCSS + ' current_day" id="' + cssID + '">' + cal_sheet[count].getDate() +circles +
                            ' </div></td>';
                } else {
                    text = text + '<td class="calendar_entry ' + noEventCSS + '" id="' + cssID + '">' + cal_sheet[count].getDate() +circles +
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



