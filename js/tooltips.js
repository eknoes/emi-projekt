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
                                        infos = infos  + "<div class='tooltip-event'>" + eventsToday[n].name + "</div>";
                                    }                        
                                }                                   
                            }
                        }
                        /*Set infos as new content*/
                        origin.tooltipster("content", infos);
                    }
                }
            });        

    $(".event_circle").tooltipster({
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
                var kategorie;
                if ($(this).hasClass("musik")) {kategorie="Musik";}
                if ($(this).hasClass("kultur")) {kategorie="Kultur";}
                if ($(this).hasClass("oeffentliches")) {kategorie="&Ouml;ffentliches";}
                if ($(this).hasClass("bildung")) {kategorie="Bildung";}
                if ($(this).hasClass("soiree")) {kategorie="Soiree";}
                if ($(this).hasClass("sonstige")) {kategorie="Sonstige";}

                var currentEvent = EVENTS.getSingle(origin.prop("id").split("-")[1]); //Holt wieder die CSS-id und splittet sie am Bindestrich, um die Nummer des Events rauszubekommen. Funktion gibt dann alle Daten zurueck
                infos = currentEvent.name + "<br>" + currentEvent.date[0] + "<br>";                      
                origin.tooltipster("content", infos);

                /* Hier unten deine alte Version */
                // $.getJSON('resources/events.json', function(data) {
             //            var infos = ""; 
             //            $.each(data.events, function (key, val) {
             //                if (val.categories == kategorie) {
             //                    infos = infos + " " + val.name + "<br>" + val.date[0] + "<br>";                      
             //                }
             //            });
             //            origin.tooltipster("content", infos);
             //            //origin.tooltipster('content', jd.events[0].name + jd.events[0].date[1]);               
                // });


            },
        functionAfter: function (origin) {
                $(".calendar_entry").tooltipster("enable");
                $(".calendar_entry").tooltipster("reposition");
            }
        });
}
