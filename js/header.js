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
    }
    else {
        $("#Navigation").css("margin-left", "0");
    }
    $("a.impbutton").css("min-width", breite/12);
}
/*Activate responsiveness on resize of window*/
$(window).resize(function (){
    resizenavi();
});
function details(info){
    var text, aktiv;
    function display(id) {
        if ($(id).css('display') === 'none') {
            $(id).css("display", "block"); 
        }
        else {     
            $(id).css("display", "none");
        }
        switch (id) {
            case '#team':
                $('#styleguide').css("display", "none");
                $('#mockups').css("display", "none");
                break;
            case '#styleguide':
                $('#mockups').css("display", "none");
                $('#team').css("display", "none");
                break;
            case '#mockups':
                $('#styleguide').css("display", "none");
                $('#team').css("display", "none");
                break;
        }
    }
    switch (info) {
        case 'team':
            display('#team');
            break;
        case 'styleguide':
            display('#styleguide');
            break;
        case 'mockups':
            display('#mockups');
            break;
    }
}