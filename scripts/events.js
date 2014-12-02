var EVENTS_JSON = "data/events.json";

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

function getEvents(askDate, category, callback) {
    var askDate = new Date(askDate);
    var result = new Array();
    $.getJSON(EVENTS_JSON, function(data) {
        $.each(data.events, function(key, entry) {
            if(isInPeriod(askDate.setHours(0,0,0,0), new Date(entry.date[0]).setHours(0,0,0,0), new Date(entry.date[1]).setHours(0,0,0,0))) {
                console.log("is in period");
                if(category !== "all") {
                    for (var i = entry.categories.length - 1; i >= 0; i--) {
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
        callback(result);

    });
}


function test_getEvents() {
    getEvents($("input#getEvents-input-date").val(), $("input#getEvents-input-category").val(), function(result) {
        console.log(result);
        $("div#getEvents-output").html(result.toSource());
    });
}

function getEventById(id, callback) {
    var result = null;
    $.getJSON(EVENTS_JSON, function(data) {
        $.each(data.events, function(key, entry) {
            if(entry.id == id) {
                result = entry;
                return false;
            }
        });
        if(result === null) {
            result = false;
        }
        callback(result);
    });
}

function test_getEventByID() {
    getEventById($("input#getEventById-input").val(), function(result) {
        console.log(result);
        $("div#getEventById-output").html(result.toSource());
    });
}