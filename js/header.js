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
        $("a.impbutton").css("min-width", breite/12);
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
function details(info){
    var text, aktiv;
    switch (info) {
        case 'team':
            text = "<b>Team</b>";
            break;
        case 'styleguide':
            text = "styleguide";
            break;
        case 'mockups':
            text = "Mockups";
            break;
    }
    aktiv = document.getElementById("impdetails").innerHTML;
    document.getElementById("impdetails").innerHTML=text;
    
        if ($("#impdetails").css('display') === 'none') {
            if (aktiv !== text) {
                $("#impdetails").css("display", "block");
            }
            else {
                $("#impdetails").css("display", "none");
            }
   
        }
        else {
            if (aktiv === text) {
                $("#impdetails").css("display", "none");
            }
            else {
                $("#impdetails").css("display", "block");
            }
        }
}