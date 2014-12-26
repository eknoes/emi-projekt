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
        changeYear: true
    });
});
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
    resizenavi();
});
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
/*Smooth scrolling*/
$(document).ready(function(){
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
});
/*toggle mobile navigation*/
$(function(){
    $(".show-menu").click(function(){
        $("#Navigation").toggle("fast");
    });
});

