var eventsHandler = function (path) {

    this.path = path;

    this.init = function(callback) {
        var self = this;
        $.getJSON(this.path, function(data) {
            self.data = data.events;
            callback();
        });
    }

    this.isInPeriod = function(checkDate, periodStart, periodEnd) {
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

    this.onDay = function(day) { 
        var result, eventStart, eventEnd, tempObject, i;

        result = [];

        day = new Date(day);
        day = day.setHours(0,0,0,0);

        for (i = this.data.length - 1; i >= 0; i--) {
            eventStart = new Date(this.data[i].date[0])
            eventStart.setHours(0,0,0,0);

            eventEnd = new Date(this.data[i].date[1])
            eventEnd.setHours(0,0,0,0);

            if(this.isInPeriod(day, eventStart, eventEnd)) {
                tempObject = this.data[i];
                tempObject.id = i;
                result.push(tempObject)
            }
        }

        return result;
    }

    this.getSingle = function(id) { 
        if(this.data[id]) {
            return this.data[id]; 
        } else {
            return false;
        }
    }

    this.search = function(value) {
        var items = [],
            foundItems = [],
            keyword = value,
            keywords,
            i,
            contentpart,
            results;

        if (keyword.length >= 1) {
            foundItems = this.searchEvents(keyword);
            if (foundItems.length > 0) {
                for (i = foundItems.length - 1; i >= 0; i--) {
                    if (foundItems[i]) {
                        if (foundItems[i].desc) {
                            contentpart = foundItems[i].desc;
                            keywords = keyword.split(" ");
                            for (var j = 0; j < keywords.length; j++) {
                                contentpart = getExcerpt(contentpart, keywords[j], j * 7);
                            }
                            if(contentpart.length > 3) {
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
        var result,
            newData = [],
            found = false,
            position = null,
            newKeyword,
            i;
        if (keyword.search(" ") !== -1) {
            keyword = keyword.split(" ");
            newKeyword = keyword[1];
            for (i = 0; i < keyword.length; i++) {
                if (i > 1) {
                    newKeyword = newKeyword + ' ' + keyword[i];
                }
            }
            result = this.searchEvents(newKeyword);
            if (result.length === 0) {
                return false;
            } else {
                keyword = keyword[0];
            }
        } else {
            result = this.data;
        }

        for (i = result.length - 1; i >= 0; i--) {
            console.log(result[i]);
            console.log(i);
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
                newData.push(result[i]);
            }
        }
        return newData;
    }

    function getExcerpt(text, keyword, makeLonger) {
        var result = "",
            newPosition,
            textBefore,
            textAfter,
            position;
        textBefore = 40 + makeLonger; // characters before keyword
        textAfter = 40 + makeLonger; // characters after keyword
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

}