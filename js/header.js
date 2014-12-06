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
        $("a").css("min-width", breite/8.617); /*adjust button size to window*/
        $("#navi").css("width", "100%");
    }
    else {
        $("#Navigation").css("margin-left", "0");
    }
}
/*Activate responsiveness on resize of window*/
$(window).resize(function (){
    resizenavi();
});