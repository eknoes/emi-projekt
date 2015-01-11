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
$(function () {
    $.datepicker.setDefaults($.extend($.datepicker.regional['de']));
    $("#datepicker").datepicker({
        showAnim: "slideDown",
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        constrainInput: false
    });
});

/*Search button Click event*/
$("#submit").click(function () {
    searchdate();
});

function reloadStuff() {
    /*smooth scroll to infos on table cell click*/
    $(".event_circle").click(function (event) {
        var eventIDs = [],
                headline;
        for (var i = event.target.id.split('-').length - 1; i > 0; i--) {
            eventIDs.push(event.target.id.split('-')[i])
        }
        ;
        if ($(this).hasClass("musik")) {
            kategorie = "Musik";
            cssClass = "musik";
        }
        if ($(this).hasClass("kultur")) {
            kategorie = "Kultur";
            cssClass = "kultur";
        }
        if ($(this).hasClass("oeffentliches")) {
            kategorie = "&Ouml;ffentliches";
            cssClass = "oeffentliches";
        }
        if ($(this).hasClass("bildung")) {
            kategorie = "Bildung";
            cssClass = "bildung";
        }
        if ($(this).hasClass("soiree")) {
            kategorie = "Soiree";
            cssClass = "soiree";
        }
        if ($(this).hasClass("sonstige")) {
            kategorie = "Sonstige";
            cssClass = "sonstige";
        }
        EVENTS.loadEvents(eventIDs, kategorie + " Events am " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
        infoscroll();
    });
    $(".calendar_entry").click(function (event) {
        if ($(event.target).is(this)) {
            var eventIDs = [];
            var date = new Date(event.target.id);
            var allEvents = EVENTS.onDay(event.target.id);

            for (var i = allEvents.length - 1; i >= 0; i--) {
                eventIDs.push(allEvents[i].id);
            }
            if (eventIDs.length == 0) {
                return false;
            } else {
                EVENTS.loadEvents(eventIDs, "Events am " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
                infoscroll();
            }
        }
    });
}

reloadStuff();

function searchdate() {
    var input = document.getElementById("datepicker");
    var button = document.getElementById("submit");
    /*scroll to infos if search button clicked*/
    if ($(input).is(':visible')) {
        /*validate input*/
        if ($(input).val() !== "") {
            search($(input).val());
            /*scroll to infos if search button clicked*/
            infoscroll();
        }
    }
    /*toggle search field*/
    $(input).toggle("fast");
}
/*smooth scroll to infos*/
function infoscroll() {
    $('html, body').animate({
        'scrollTop': $('#infos').offset().top
    }, 900);
}
(jQuery);

/*Responsive Navigation Bar*/
function resizenavi() {
    var breite = $(window).width(); /*Calculate window width*/
    /*"Oeffentliches" doesnt get smaller than 122 px with initial font-size. This reduces font-size*/
    if (breite <= 1300) {
        $("a.navbutton").css("font-size", 13);
    }
    else {
        $("a.navbutton").css("font-size", "initial");
    }
    if (breite >= 1000) {
        $("a.navbutton").css("min-width", 0.7 * breite / 7 - 1); /*adjust button size to window*/
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
        $(".navbuttonmobile").css("font-size", "initial");
        /*Quickinfo Table full sized*/
        $("#ContentsTable").css("width", "100%");
        /*Puts preview pictures below quick info text*/
        $("#infoPictures").css("position", "static");
        $("#infoBlock1").css("height", "auto");
        $("#infoPictures").css("width", "100%");

        $("#infoPictures").css("height", breite / 2); /*better aspect ratio on mobile devices*/
        $(".slider").css("height", breite / 6); /*keeps slider aspect ratio*/
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
    $("a.impbutton").css("min-width", breite / 12);
}
/*Activate responsiveness on resize of window*/
$(window).resize(function () {
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
function details(info) {
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

/*$(document).ready(function(){
 //Smooth scrolling
 $('a[href^="#"]').on('click',function (e) {
 e.preventDefault();
 var target = this.hash;
 var $target = $(target);
 $('html, body').stop().animate({
 'scrollTop': $target.offset().top
 }, 900, 'swing', function () {
 //window.location.hash = target; shows anchor in URL
 });
 //hide mobile Navigation onclick
 if($('#Navigation li').find('a.navbuttonmobile').length !== 0){
 $("#Navigation").hide();
 }
 
 });
 });*/
/*toggle mobile navigation*/
$(function () {
    $(".show-menu").click(function () {
        $("#Navigation").toggle("fast");
    });
});
/*detect wrap of event circles*/
function circlewrap() {
    var y1 = $(".circles div:first-child").offset();
    var y2 = $(".circles div:last-child").offset();
    var breite = $(".event_circle").css("width");
    var circleswidth = $("div.circles").width();
    var cellwidth = $("#calendar_entry_8").outerWidth(); // ACHTUNG!
    /*make circles smaller*/
    if (y1 && y2) {
        if (y1.top !== y2.top) {
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
    }

    /*Make circles bigger*/
    switch (breite) {
        case '10px':
            if (cellwidth > circleswidth + 20) {
                $(".event_circle").css("height", "12px");
                $(".event_circle").css("width", "12px");
            }
            break;
        case '8px':
            if (cellwidth > circleswidth + 20) {
                $(".event_circle").css("height", "10px");
                $(".event_circle").css("width", "10px");
                $(".calendar_head, .calendar_head_month").css("font-size", "30px");
            }
            break;
    }
}
;
