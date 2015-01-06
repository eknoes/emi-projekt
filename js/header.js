/*Sticky Navigation Bar Options and Initialisation*/
$().ready(function () {
    var stickyPanelOptions = {
        topPadding: 0,
        afterDetachCSSClass: "BoxGlow_Grey2",
        savePanelSpace: true,
        parentSelector: null
    };
    $("#navi").stickyPanel(stickyPanelOptions);
});
/* Datepicker Options and Initialisation*/
$(function(){
    $.datepicker.setDefaults($.extend($.datepicker.regional['de']));
    $("#datepicker").datepicker({
        showAnim: "slideDown",
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        onClose: function() {
            $("#datepicker").hide("fast");
        }
    });
});

/*Search button Click event*/
$("#submit").click(function () {
    searchdate();    
});
/*smooth scroll to infos on table cell click*/
$(".calendar_entry").click(function () {
    infoscroll();
});
function searchdate() {
    var input = document.getElementById("datepicker");
    var button = document.getElementById("submit");
    /*scroll to infos if search button clicked*/
    if ($(input).is(':visible'))  {
        /*validate input*/
        if ($(input).val() == "") {
            alert("Fehler!");
            return;
        }
        /*scroll to infos if search button clicked*/        
        infoscroll();
    }
    /*toggle search field*/
    $(input).toggle("fast");    
}
/*smooth scroll to infos*/        
function infoscroll() {
     $('html, body').animate({
        'scrollTop':   $('#infos').offset().top
     }, 900);
}(jQuery);            
        
/*Responsive Navigation Bar*/
function resizenavi (){
    var breite = $(window).width(); /*Calculate window width*/
    if (breite>=1000) {
        $("a.navbutton").css("min-width", breite/8.617); /*adjust button size to window*/    
        $("#navi").css("width", "100%");
        $(".navbuttonmobile").switchClass("navbuttonmobile", "navbutton");
        /*show navigation bar in case it was hidden */
        $("#Navigation").show();
        /*Quickinfo Table full sized*/
        $("#ContentsTable").css("width", "50%");
        /*Puts preview pictures next to quick info text*/
        $("#infoPictures").css("position", "absolute");
        $("#infoBlock1").css("height", "250px");
        $("#infoPictures").css("width", "39%");
        
        $("#infoPictures").css("height", "250px"); /*Set initial height*/
        $(".slider").css("height", "170px"); /*Set initial height*/
        $("#titleQuickInfo").css("width", "59%");
        /*Make content div smaller*/
        $("#inhalt").css("width", "70%");
        /*set map size initial*/
        $("#maps").css("width", "600px"); 
        $("#infoBlockAnfahrtText").css("position", "absolute");
        $("#infoBlockAnfahrtText").css("display", "inline-block");
        $("#infoBlockAnfahrtText").css("top", "50%");
        $("#infoBlockAnfahrtText").css("transform", "translate(0px, -50%)");
    }
    else {
        $("#Navigation").css("margin-left", "0");
        $(".navbutton").switchClass("navbutton", "navbuttonmobile");
        /*Quickinfo Table full sized*/
        $("#ContentsTable").css("width", "100%");
        /*Puts preview pictures below quick info text*/
        $("#infoPictures").css("position", "static");
        $("#infoBlock1").css("height", "auto");
        $("#infoPictures").css("width", "100%");
        
        $("#infoPictures").css("height", breite/2); /*better aspect ratio on mobile devices*/
        $(".slider").css("height", breite/6); /*keeps slider aspect ratio*/
        $(".BoxGlow_Grey2").css("width", "100%"); /*fixes error in resizing sticky panel when scrolled down*/
        
        
        $("#titleQuickInfo").css("width", "100%");
        /*Make content div wider*/
        $("#inhalt").css("width", "98%");
         /*resize maps size to fit screen*/
        $("#maps").css("width", "100%");
        $("#infoBlockAnfahrtText").css("position", "static");
        $("#infoBlockAnfahrtText").css("display", "inline");
        $("#infoBlockAnfahrtText").css("top", "0");
        $("#infoBlockAnfahrtText").css("transform", "none");
    }
    $("a.impbutton").css("min-width", breite/12);
}
/*Activate responsiveness on resize of window*/
$(window).resize(function (){
    ini();
});
/*initial resize of all objects to look good*/
function ini() {
    resizenavi();
    circlewrap();
}
/*Load ini on document load*/
window.onload = ini();

/*Impressum tab hide/show*/
function details(info){
    switch (info) {
        case 'team':
            $("#team").toggle("fast");
            $("#styleguide").hide();
            $("#mockups").hide();
            break;
        case 'styleguide':
            $("#styleguide").toggle("fast");
            $("#mockups").hide();
            $("#team").hide();
            break;
        case 'mockups':
            $("#mockups").toggle("fast");
            $("#styleguide").hide();
            $("#team").hide();
            break;
    }    
}

$(document).ready(function(){
        /*Smooth scrolling*/
	$('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();
	    var target = this.hash;
	    var $target = $(target);
	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
                /*window.location.hash = target; shows anchor in URL*/
	    });
            /*hide mobile Navigation onclick*/
            if($('#Navigation li').find('a.navbuttonmobile').length !== 0){
                $("#Navigation").hide();
            }
            
	});

    var EVENTS = new eventsHandler("resources/events.json"); //Um mit der Event Klasse arbeiten zu koennen, muss sie einmalig initialisiert werden. Näheres im Wiki
    EVENTS.init(function() { //WRAPPED IN INIT CALLBACK
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
                                case "Soiree": kategorie[4]=true; break;
                                case "Bildung": kategorie[3]=true; break;                                
                                case "Sonstige": kategorie[5]=true; break;
                            }
                        }
                        console.log()
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



                    /* Deine alte Funktion habe ich hier gelassen */
                    // $.getJSON('resources/events.json', function(data) {
                    //     /*iterate through whole json to find all available categories*/
                    //     for (var i = 0; i < data.events.length; i++)
                    //     {
                    //         switch (data.events[i].categories[0]) {
                    //             case "Kultur": kategorie[0]=true; break;
                    //             case "Musik": kategorie[1]=true; break;                                
                    //             case "&Ouml;ffentliches": kategorie[2]=true; break;
                    //             case "Soiree": kategorie[4]=true; break;
                    //             case "Bildung": kategorie[3]=true; break;                                
                    //             case "Sonstige": kategorie[5]=true; break;
                    //         }                            
                    //     }
                    //     /*iterate through categories boolean array*/
                    //     for (var i = 0; i < 6; i++) {
                    //         if (kategorie[i]){
                    //             /*Adds category title to content*/
                    //             infos = infos + "<h3 class='tooltip-title " + classes[i] + "'>" + kategorien[i] + "</h3>";
                    //             /*iterates through all events with the actual category...*/
                    //             for (var n = 0; n < data.events.length; n++)
                    //             {
                    //                 if (data.events[n].categories == kategorien[i]) {
                    //                     /*...and adds them to content*/
                    //                     infos = infos  + "<div class='tooltip-event'>" + data.events[n].name + "</div>";
                    //                 }                        
                    //             }                                   
                    //         }
                    //     }
                    //     /*Set infos as new content*/
                    //     origin.tooltipster("content", infos);
                    //     //origin.tooltipster('content', jd.events[0].name + jd.events[0].date[1]);				
                    //});
                }
            });        
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
    }); }); //END WRAPPING IN INIT CALLBACK
/*toggle mobile navigation*/
$(function(){
    $(".show-menu").click(function(){
        $("#Navigation").toggle("fast");
    });
});
/*detect wrap of event circles*/
function circlewrap () {
    var y1=$(".circles div:first-child").offset();
    var y2=$(".circles div:last-child").offset();
    var breite = $(".event_circle").css("width");
    var circleswidth = $("div.circles").width();
    var cellwidth = $("#calendar_entry_8").outerWidth();
    /*make circles smaller*/
    if (y1.top!==y2.top) {
        /*alert("Wrap!!!");*/       
        switch (breite) {
            case '12px':
                $(".event_circle").css("height", "10px");
                $(".event_circle").css("width", "10px");
                break;
            case '10px':
                $(".event_circle").css("height", "8px");
                $(".event_circle").css("width", "8px");
                $(".calendar_head, .calendar_head_month").css("font-size", "20px");
                break;
        }
    }

    /*Make circles bigger*/
    switch (breite) {
            case '10px':
                if (cellwidth>circleswidth+20) {
                    $(".event_circle").css("height", "12px");
                    $(".event_circle").css("width", "12px");
                }
                break;
            case '8px':
                if (cellwidth>circleswidth+20) {
                    $(".event_circle").css("height", "10px");
                    $(".event_circle").css("width", "10px");
                    $(".calendar_head, .calendar_head_month").css("font-size", "30px");
                }                
                break;
        }
};
