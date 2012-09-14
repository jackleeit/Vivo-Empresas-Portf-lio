$(document).ready(function(){
    var accordion = (function(){

        var $currentItem,

        itemOnClass = "topicOn",

        accordionContent = ".accordionContent",

        animationConfig = {
            duration: 900,
            easing: 'swing'
        },

        showItem = function(event){

            event.preventDefault();

            $currentItem = $(this);

            showContent();
        },

        showContent = function(){

            if ( ! $currentItem.hasClass(itemOnClass))
            {
                $currentItem
                .addClass(itemOnClass)
                .parent()
                .next(accordionContent)
                .slideDown(animationConfig.duration, animationConfig.easing, showContentCallback);
            }
            else
            {
                $currentItem
                .parent()
                .next(accordionContent)
                .slideUp(animationConfig.duration, animationConfig.easing, hideContentCallback);
            }

            hideContent();
        },

        hideContent = function(){

            $currentItem
            .parent()
            .siblings('h3')
            .each(function(){

                $(this)
                .next(accordionContent)
                .slideUp(animationConfig.duration, animationConfig.easing,
                    function(){
                        setTimeout(function(){
							
							if (myScroll)
							{
								myScroll.refresh();
							}                            
                        }, 0);

                    });
                    
                $(this).find('a').removeClass(itemOnClass);
            });
        },

        showContentCallback = function(){

            /*setTimeout(function(){
				if (myScroll)
				{
					myScroll.refresh();
				}                
            }, 0);*/
        },

        hideContentCallback = function(){

            $currentItem.removeClass(itemOnClass);

            /*setTimeout(function(){
				if (myScroll)
				{
					myScroll.refresh();
				} 
            }, 0);*/
        };


        $("#accordion").delegate('h3 a', 'click', showItem);

    })();
});