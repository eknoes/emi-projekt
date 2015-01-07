var eventsHandler = function (path) {
    /* 
    path: Pfad zum JSON File
    Eine Klasse, die die events.json Datei verarbeitet, und ihre Daten dann zur Verfuegung stellt. */

    this.path = path;
    this.category = 'all';

    this.init = function(callback) {
        console.log("Init");
        /* Initialisierungsfunktion, die einmalig aufgerufen werden muss. Wenn die Events aus dem JSON File fertig verarbeitet wurden, wird die callback Funktion aufgerufen. */
        var self = this; //this ist in getJSON nicht mehr verfuegbar, also wird es auf self gelegt.
        $.getJSON(this.path, function(data) {
            self.data = data.events;
            callback();
        });
    }

    this.isInPeriod = function(checkDate, periodStart, periodEnd) {
        /* Checkt ob ein Zeitpunkt (checkDate) in einer Zeitperiode (periodStart -> periodEnd) liegt. checkDate kann z.B. ein Tag sein, periodStart und periodEnd Anfang und Ende eines Events. Die Eingaben werden in Javascript-Date Objekte umgewandelt, sodass viele Datumsformatierungen unterstuetzt werden */

        checkDate = new Date(checkDate);
        periodStart = new Date(periodStart);
        periodEnd = new Date(periodEnd);

        if((periodStart.valueOf() <= checkDate.valueOf()) && (checkDate.valueOf() <= periodEnd.valueOf())) {
            return true;
        } else {
            return false;
        }
    }

    this.onDay = function(day, category) { 
        /* Gibt ein Array zurueck, dass alle Events enthält, welche an einem bestimmten Zeitpunkt stattfinden. day wird in ein JS-Date Objekt umgewandelt, sodass viele Datumsformatierungen unterstuetzt werden. */
        category = (typeof category === "undefined") ? this.category : category;
        category = (category === "oeffentliches") ? "&ouml;ffentliches" : category;
        if(category != this.category && this.category != "all") {
            return [];
        }
        var result, eventStart, eventEnd, tempObject, i;
        result = [];

        day = new Date(day);
        day = day.setHours(0,0,0,0); // Damit alle Datumsobjekte zum selben Zeitpunkt stattfinden, werden alle Uhrzeiten auf 0:00:00 gesetzt.

        for (i = this.data.length - 1; i >= 0; i--) {
            eventStart = new Date(this.data[i].date[0])
            eventStart.setHours(0,0,0,0);

            eventEnd = new Date(this.data[i].date[1])
            eventEnd.setHours(0,0,0,0);

            if(this.isInPeriod(day, eventStart, eventEnd)) { //Wenn der Tag zwischen dem Start und Ende liegt, wird das Event zum result-Array hinzugefuegt.
                if(category != 'all') {
                    if(this.data[i].categories[0].toLowerCase() == category) {
                        tempObject = this.data[i];
                        tempObject.id = i; //Die ID ist der Index, welcher sich bei diesem resultArray veraendert wird, also wird sie als seperater Wert hinzugefuegt.
                        result.push(tempObject)
                    }
                } else {
                    tempObject = this.data[i];
                    tempObject.id = i; //Die ID ist der Index, welcher sich bei diesem resultArray veraendert wird, also wird sie als seperater Wert hinzugefuegt.
                    result.push(tempObject)
                }
            }
        }

        return result;
    }

    this.getSingle = function(id) { 
        /* Gibt ein Event mit einer bestimmten id zurueck */
        if(this.data[id]) {
            return this.data[id]; 
        } else {
            return false;
        }
    }

    this.search = function(keyword) {
        /* Durchsucht alle Events (Name, Description, Tags und Categories) nach den Keywords im Keywordstring. Dieser wird an den Leerzeichen getrennt, nach allen Keywords wird einzeln gesucht, es werden nur Events zurueckgegeben, die alle Keywords enthalten. Ausserdem wird ein kurzer Ausschnitt zurueckgegeben, in dem die Keywords vorkommen. */
        var items = [],
            foundItems = [],
            keywords,
            i,
            contentpart,
            results = []; 

        if (keyword.length >= 1) {
            foundItems = this.searchEvents(keyword); //Die eigentliche Suche ist in eine rekursive Funktion ausgelagert. Diese gibt ein Array mit den gefundenen Events zurueck
            if (foundItems.length > 0) {
                for (i = foundItems.length - 1; i >= 0; i--) {
                    if (foundItems[i].desc) { //Wenn eine Beschreibung existiert, wird ein Ausschnitt generiert
                        contentpart = foundItems[i].desc;
                        keywords = keyword.split(" ");
                        for (var j = 0; j < keywords.length; j++) {
                            contentpart = getExcerpt(contentpart, keywords[j], j * 7);  //Jedes Keyword wird markiert, da pro gefundenem Keyword 7 neue Zeichen hinzugefuegt werden (<b></b>), wird es pro Keyword um 7 Zeichen verlaengert
                        }
                        if(contentpart.length > 8) { //Falls kein Keyword in der desc. auftaucht.
                            contentpart = '<p>[...]' + contentpart + '[...]</p>';
                        } else {
                            contentpart = "";
                        }
                    } else {
                        contentpart = "";
                    }
                    items.push({
                        'event': foundItems[i],
                        'excerpt': contentpart
                    });
                }
                results = [];
                i = 0;
                for (i; i < items.length; i = i + 1) {
                    results.push(items[i]);
                }
                console.log(results);
                return results;
            } else {
                return false;
            }
        }
    }

    this.searchEvents = function(keyword) {
        /* rekursive Funktion, die "keyword" solange an den Leerzeichen aufsplittet, bis es nur noch ein Wort ist und danach dann alle Datensaetze durchsucht. Die "hoehere" Instanz durchsucht dann nur noch die Ergebnisse der ersten Suche usw. */
        var result,
            newData = [],
            found = false,
            position = null,
            newKeyword,
            lowestSearch = false,
            i;
        if (keyword.search(" ") !== -1) { //Keyword Aufsplitten
            keyword = keyword.split(" ");
            newKeyword = keyword[1];
            for (i = 0; i < keyword.length; i++) {
                if (i > 1) { //Alle bis auf das "Nullte" werden weitergegeben, das Nullte wird in dieser Funktion bearbeitet
                    newKeyword = newKeyword + ' ' + keyword[i];
                }
            }
            result = this.searchEvents(newKeyword); //Rekursion gibt zu durchsuchenden Datensatz zurueck
            if (result.length === 0) {
                return false;
            } else {
                keyword = keyword[0];
            }
        } else {
            result = this.data;
            lowestSearch = true; //Die "niedrigste" der rekursiven Funktion
        }
 
        for (i = result.length - 1; i >= 0; i--) { 
            /*  Hier beginnt die eigentliche Suche. Suchbegriff sowie zu durchsuchendes wird in Kleinbuchstaben verwandelt,
                da die Suche nicht case-sensitive sein soll: MuSiK == Musik == musik
                Es wird jeweils gesucht, ob das zu durchsuchende Objekt ueberhaupt eine Beschreibung, Namen, usw. hat.
                Falls ja, wird nach der position des Suchwortes gesucht. -1 bedeutet, sie wurde nicht gefunden.
            */
            found = false;
            if (result[i].desc) {
                position = result[i].desc.toLowerCase().search(keyword.toLowerCase());
                if (position !== -1) {
                    found = true;
                }
            }
            if (result[i].name) {
                position = result[i].name.toLowerCase().search(keyword.toLowerCase());
                if (position !== -1) {
                    found = true;
                }
            }
            if (result[i].tags) {
                for (var j = result[i].tags.length - 1; j >= 0; j--) {
                    position = result[i].tags[j].toLowerCase().search(keyword.toLowerCase());
                    if (position !== -1) {
                        found = true;
                    }
                }
            }
            if (result[i].categories) {
                for (var j = result[i].categories.length - 1; j >= 0; j--) {
                    position = result[i].categories[j].toLowerCase().search(keyword.toLowerCase());
                    if (position !== -1) {
                        found = true;
                    }
                }
            }
            if (found === true) {
                if(lowestSearch === true) {
                    result[i].id = i; //Wenn der originale Datensatz bearbeitet wird, soll die id hinzugefuegt werden.
                }
                newData.push(result[i]);
            }
        }
        return newData;
    }

    this.loadEvents = function(id, headline) {
        var output = '';
        for (var i = id.length - 1; i >= 0; i--) {
            output = this.eventInfo(id[i]) + output;
        }
        //$('#infos .accordion').attr( "class", "accordion" ); //Alle anderenKlassen entfernen
        $('#infos .accordion').html(output);
        this.appendHelp();
        $(".accordion").accordion("refresh");
        if(id.length > 1) {
            $(".accordion").accordion("option", "active", false);
        } else {
            $(".accordion").accordion("option", "active", 0);
        }
        console.log(headline);
        headline = (typeof headline === "undefined") ? "Event&uuml;bersicht" : headline;
        $('h1.detailInfo').html(headline);

    }

    this.eventInfo = function(id) {
        var tempResult = Array(),
            when,
            current = this.data[id],
            start = new Date(this.data[id].date[0]),
            end = new Date(this.data[id].date[1]),
            result = '',
            wochentag = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];


        tempResult.push('<h3>' + current.name + '</h3>');
        tempResult.push('<div><div class="infoBlock" id="infoBlock1"><div class="title" id="titleQuickInfo"><h3>Auf einen Blick </h3></div>');
        tempResult.push('<table id="ContentsTable">');

        if(current.tags) {
            tempResult.push('<tr><td class="TableHead">Was?</td><td>');
            for (var i = current.tags.length - 1; i >= 0; i--) {
                tempResult.push(current.tags[i] + ' ');
            }
            tempResult.push('</td></tr>')
        }




        when = wochentag[start.getDay()] + ', ' + ("0" + start.getDate()).slice(-2) + '.' + ("0" + (start.getMonth() + 1)).slice(-2) + '.' + start.getFullYear() + ', ' + start.getHours() + ':' + ("0" + start.getMinutes()).slice(-2);

        if(start.getDay() === end.getDay() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            when = when + ' - ' + end.getHours() + ':' + ("0" + end.getMinutes()).slice(-2);
        } else {
            when = when + ' - ' + ("0" + end.getDate()).slice(-2) + '.' + ("0" + (end.getMonth() + 1)).slice(-2) + '.' + end.getFullYear() + ', ' + end.getHours() + ':' + ("0" + end.getMinutes()).slice(-2);
        }

        tempResult.push('<tr><td class="TableHead">Wann?</td><td>' + when + '</td></tr>');
        tempResult.push('<tr><td class="TableHead">Wo?</td><td>' + current.adress + '</td></tr>');

        if(current.admission) {
            if(current.admission == 0) {
                tempResult.push('<tr><td class="TableHead">Eintritt:</td><td>frei</td></tr>');
            } else {
                tempResult.push('<tr><td class="TableHead">Eintritt:</td><td>ab ' + current.admission + ' &euro;</td></tr>');
            }
        } else {
            tempResult.push('<tr><td class="TableHead">Eintritt:</td><td>unbekannt</td></tr>');
        }        

        if(current.link) {
            tempResult.push('<tr><td class="TableHead">Website:</td><td><a href="' + current.link[1] + '">' + current.link[0] + '</a></td></tr></table>');
        }

        if(current.image && current.image[0] != '') {
            tempResult.push('<div id ="infoPictures"><div id="infoPicturesBig"><img id="mainimage" src="' + current.image[0] + '"></div></div>');
        }
        tempResult.push('</div>');

        tempResult.push('<div class="infoBlock"><div class="title"><h3>Details </h3></div>');
        tempResult.push('<div id="infoBlockDetailsText"><p>' + current.desc + '</p></div></div>');

        tempResult.push('<div class="infoBlock"><div class="title"><h3>Anfahrt </h3></div>');
        tempResult.push('<iframe id="maps" width="100%" height="300" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAVGVXDpzXDcLyZiPUDKdMliYsKFq55kxg&q=' + current.adress + '&language=de-DE" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>');

        tempResult.push('</div></div>');

        for (var i = 0; tempResult.length - 1 >= i; i++) {
            result = result + tempResult[i];
        }

        return result;

    }

    this.setCategory= function(category) {
        $('a.current_cat').removeClass('current_cat');
        $('a#a_'+category).addClass('current_cat');
 
        if(category == "oeffentliches") {
            category = '&ouml;ffentliches';
        }
        this.category = category;

        write();
    }

    function getExcerpt(text, keyword, makeLonger) {
        /* Erzeugt einen Ausschnitt aus einem Text (text), in dem das keyword im Zentrum steht und fett markiert wird. Standardmaesig betraegt der Ausschnitt +/- 40 Zeichen um das Wort herum, es kann mit makeLonger verlaengert werden */
        var result = "",
            newPosition,
            textBefore,
            textAfter,
            position;
        textBefore = 40 + makeLonger; // zeichen vor dem keyword
        textAfter = 40 + makeLonger; // zeichen nach dem keyword
        position = text.toLowerCase().search(keyword.toLowerCase());
        if(position != -1) {
            result = text.slice(0, position) + '<b>' + text.slice(position, position + keyword.length) + '</b>' + text.slice(position + keyword.length, text.length);
            newPosition = position;

            if (textBefore < position) {
                result = result.slice(position - textBefore, text.length);
                newPosition = textBefore;
            }

            if (position + textAfter < text.length) {
                result = result.slice(0, newPosition + keyword.length + textAfter);
            }

            result = result.slice(result.indexOf(' '), result.lastIndexOf(' '));
            return result;
        } else {
            return false;
        }
    }

    this.appendHelp = function (argument) {
        var text;
        text = '<h3>Hilfe</h3>';
        text = text + '<div>';
        text = text + '<p>Um eine Übersicht über die jeweiligen Events eines Tages zu haben, fahren sie mit der Maus &uuml;ber den Kalendereintrag.';
        text = text + 'Um ein Event zu &ouml;ffnen, klicken sie den kleinen, farbigen Kreis an.</p>';
        text = text + '<p>Jede Farbe steht f&uuml;r eine andere Kategorie:';
        text = text + '<div class="event_circle kultur help"></div> Kultur<br />';
        text = text + '<div class="event_circle musik help"></div> Musik<br />';
        text = text + '<div class="event_circle oeffentliches help"></div> &Ouml;ffentliches<br />';
        text = text + '<div class="event_circle soiree help"></div> Soiree<br />';
        text = text + '<div class="event_circle bildung help"></div> Bildung<br />';
        text = text + '<div class="event_circle sonstige help"></div> Sonstige<br />';
        text = text + '</p>';
        text = text + '</div>';
        $('#infos .accordion').append(text);
    }

}

var EVENTS = new eventsHandler("resources/events.json");

EVENTS.init(function() {
    var today = new Date();
    generateMonth(today.getMonth(), today.getFullYear());
    write();
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = "js/header.js";
    $("head").append(script);

    EVENTS.appendHelp();
    $(".accordion").accordion({
        collapsible: true,
        heightStyle: "content"
    });
});