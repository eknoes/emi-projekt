function reTooltipster()  {
        /*Tooltips in calendar*/        
        $('.calendar_entry').tooltipster({
                content: 'L&auml;dt...',
                theme: 'tooltipster-light',
                animation: 'grow',
                position: 'right',
                //onlyOne: true,                
                maxWidth: 200,
                /*autoClose: false,*/ /*Good for analyzing html and css of tooltip*/
                contentAsHTML: true,
                functionBefore: function (origin, continueTooltip) {
                    continueTooltip();                          
                    var eventsToday = EVENTS.onDay(origin.prop("id")); //origin.prop holt die id der aufgerufenen Zelle, also das Datum, um das es sich handelt, und ruft damit dann eine Funktion auf, die alle Events an diesem Tag zurueckgibt.
                    if(eventsToday.length == 0) {
                        origin.tooltipster("content", "An diesem Tag finden leider keine Veranstaltungen statt");
                    }
                    else { //Ab hier eigentlich genau wie vorher
                        var infos = "";   /*Stores the loaded tooltip content*/
                        var kategorie=[]; /*booleans checking for categories*/
                        var kategorien = ["Kultur", "Musik", "&Ouml;ffentliches", "Soiree", "Bildung", "Sonstige"]; /*Names of Categories for content and comparison with json*/
                        var classes = ["kultur", "musik", "oeffentliches", "soiree", "bildung", "sonstige"]; /*class names for tags*/

                        for (var i = 0; i < eventsToday.length; i++) {
                            switch (eventsToday[i].categories[0]) {
                                case "Kultur": kategorie[0]=true; break;
                                case "Musik": kategorie[1]=true; break;                                
                                case "&Ouml;ffentliches": kategorie[2]=true; break;
                                case "Soiree": kategorie[3]=true; break;
                                case "Bildung": kategorie[4]=true; break;                                
                                case "Sonstige": kategorie[5]=true; break;
                            }
                        }
                        /*iterate through categories boolean array*/
                        for (var i = 0; i < 6; i++) {
                            if (kategorie[i]){
                                /*Adds category title to content*/
                                infos = infos + "<h3 class='tooltip-title " + classes[i] + "'>" + kategorien[i] + "</h3>";
                                /*iterates through all events with the actual category...*/
                                for (var n = 0; n < eventsToday.length; n++)
                                {
                                    if (eventsToday[n].categories == kategorien[i]) {
                                        /*...and adds them to content*/
                                        infos = infos  + "<p>" + eventsToday[n].name + "</p>";
                                    }                        
                                }                                   
                            }
                        }
                        /*Set infos as new content*/
                        origin.tooltipster("content", infos);
                    }
                }
            });        

    $(".event_circle:not(.help)").tooltipster({
        content: 'Loading...',
        theme: 'tooltipster-light',
        animation: 'grow',
        position: 'left',
        //onlyOne: true,
        maxWidth: 200,
        contentAsHTML: true,
        functionBefore: function (origin, continueTooltip) {
                continueTooltip();      

                $(".calendar_entry").tooltipster("hide");
                var kategorie, cssClass;
                if ($(this).hasClass("musik")) {kategorie="Musik"; cssClass="musik";}
                if ($(this).hasClass("kultur")) {kategorie="Kultur"; cssClass="kultur";}
                if ($(this).hasClass("oeffentliches")) {kategorie="&Ouml;ffentliches"; cssClass="oeffentliches";}
                if ($(this).hasClass("bildung")) {kategorie="Bildung"; cssClass="bildung";}
                if ($(this).hasClass("soiree")) {kategorie="Soiree"; cssClass="soiree";}
                if ($(this).hasClass("sonstige")) {kategorie="Sonstige"; cssClass="sonstige";}

                var infos = '<h3 class="tooltip-title ' + cssClass + '"">' + kategorie + '</h3>';
                for (var i = origin.prop("id").split("-").length - 1; i > 0; i--) {
                    var currentEvent = EVENTS.getSingle(origin.prop("id").split("-")[i]);
                    var d = new Date(currentEvent.date[0]);
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1; //Months are zero based
                    var curr_year = d.getFullYear();
                    var curr_hours = d.getHours();
                    var curr_minutes = d.getMinutes();
                    if (curr_minutes < 10) {
                        curr_minutes = '0' + curr_minutes;
                    }
                    infos = infos + '<p>' + currentEvent.name + '<br><i>Beginn: ' + curr_date + '.' + curr_month + '.' + curr_year + '&nbsp;' + curr_hours + ':' + curr_minutes + ' Uhr</i></p>';
                };

                origin.tooltipster("content", infos);
            },
        functionAfter: function (origin) {
                $(".calendar_entry").tooltipster("enable");
                $(".calendar_entry").tooltipster("reposition");
            }
        });
}
