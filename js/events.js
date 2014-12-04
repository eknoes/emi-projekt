var EVENTS_JSON = "data/events.json";

var EVENT_DATES = Array();


function preloadDates() {
    $.getJSON(EVENTS_JSON, function(data) {
        var tempEventDates = Array();
        $.each(data.events, function(key, entry) { // quasi eine "jQuery"-Schleife durch alle Elemente (= Events) aus der JSON Datei
            var start = new Date(entry.date[0]);
            var end = new Date(entry.date[1]);
            console.log(entry);
            start.setHours(0,0,0,0);
            end.setHours(0,0,0,0);

            if(start == end) { // Events finden am selben Tag statt.
                if(tempEventDates[start.valueOf()]) {
                    tempEventDates[start.valueOf()].push(key);
                } else {
                    tempEventDates[start.valueOf()] = Array();
                    tempEventDates[start.valueOf()].push(key);
                }
            } else {
                var dateDifference = ((end.valueOf() - start.valueOf()) / 24*60*60*1000);
                for (var i = dateDifference; i >= 0; i--) { // Die Differenz von End- und Starttag
                    if(tempEventDates[start.valueOf() + i*24*60*60*1000]) { //Start + i * 1 Tag
                        tempEventDates[start.valueOf() + i*24*60*60*1000].push(key);
                    } else {
                        tempEventDates[start.valueOf() + i*24*60*60*1000] = Array();
                        tempEventDates[start.valueOf() + i*24*60*60*1000].push(key);
                    }
                };
            }
        });
        EVENT_DATES = tempEventDates;
    });
}

preloadDates();

function isInPeriod(checkDate, periodStart, periodEnd) {
    // Checks wether a given Date is in a given period.
    checkDate = new Date(checkDate);
    periodStart = new Date(periodStart);
    periodEnd = new Date(periodEnd);

    if((periodStart.valueOf() <= checkDate.valueOf()) && (checkDate.valueOf() <= periodEnd.valueOf())) {
        return true;
    } else {
        return false;
    }
}

function dateHasEvent(askDate) {
    var askDate = new Date(askDate);
    askDate.setHours(0,0,0,0);
    if(EVENT_DATES) {
        if(EVENT_DATES[askDate]) {
            return EVENT_DATES[askDate];
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getEvents(askDate, category, callback) {
    // Funktion sucht alle Events am askDate aus der jeweiligen category und übergibt ein Array mit allen JS Objekten an die callback Funktion
    var askDate = new Date(askDate);
    var result = new Array();
    askDate.setHours(0,0,0,0);
    $.getJSON(EVENTS_JSON, function(data) { //jQuery: öffnet JSON Datei.
        $.each(data.events, function(key, entry) { // quasi eine "jQuery"-Schleife durch alle Elemente (= Events) aus der JSON Datei
            if(isInPeriod(askDate, new Date(entry.date[0]).setHours(0,0,0,0), new Date(entry.date[1]).setHours(0,0,0,0))) { //Da es mir nur um den Tag gibt, setze ich die Uhrzeit auf 0:00 Uhr.
                if(category !== "all") {
                    for (var i = entry.categories.length - 1; i >= 0; i--) { //Alle Kategorien werden durchgegangen, falls eine übereinstimmt wird abgebrochen.
                        if(entry.categories[i] == category) {
                            result.push(entry);
                            break;
                        }
                    };
                } else {
                    result.push(entry);
                }
            }
        });
        if(result.length === 0) {
            result = false;
        }
        callback(result); //Resultate werden wg. Asynchronitaet an die callback-Funktion übergeben
    });
}


function test_getEvents() { //Immer der jeweilige Test für die gerade geschriebene Funktion.
    getEvents($("input#getEvents-input-date").val(), $("input#getEvents-input-category").val(), function(result) {
        console.log(result);
        $("div#getEvents-output").html(result.toSource());
    });
}

function getEventById(id, callback) {
    //Gibt ein Event mit der id an die callback Funktion
    var result = null;
    $.getJSON(EVENTS_JSON, function(data) {
        if(data.events[id]) {
            callback(data.events[id]);
        } else {
            callback(false);
        }
    });
}

function test_getEventByID() {
    getEventById($("input#getEventById-input").val(), function(result) {
        console.log(result);
        $("div#getEventById-output").html(result.toSource());
    });
}