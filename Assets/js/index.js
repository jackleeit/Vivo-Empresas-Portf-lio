var myScroll;

function loaded(){

	if (document.addEventListener)
	{
		document.addEventListener('touchmove', function(e){
			e.preventDefault();
		});		
	}

    myScroll = new iScroll($("#main section")[0], {
        checkDOMChanges: false
    });
}

if (document.addEventListener)
{
	document.addEventListener('DOMContentLoaded', loaded);
}