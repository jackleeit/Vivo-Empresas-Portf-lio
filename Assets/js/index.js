var myScroll;

function loaded(){

    document.addEventListener('touchmove', function(e){
        e.preventDefault();
    });

    myScroll = new iScroll($("#main section")[0], {
        checkDOMChanges: false
    });
}

document.addEventListener('DOMContentLoaded', loaded);