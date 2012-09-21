$(document).ready(
		function() {
			
			var accordion = (function() {

				var $currentItem,
				
				interval,
				
				maxAvailableHeight = 584, 

				itemOnClass = "topicOn",

				accordionContent = ".accordionContent",

				animationConfig = {
					duration : 900,
					easing : 'swing'
				},

				showItem = function(event) {

					event.preventDefault();

					$currentItem = $(this);

					showContent();
				},

				showContent = function() {
					if ( ! $currentItem.hasClass(itemOnClass)) {	
					
						var $h3 = $currentItem.parent();

						if (myScroll
								&& ($h3.get(0).offsetTop > maxAvailableHeight)) {
								
								myScroll.scrollToElement("article h2", "1000ms");
						}			
						
						$currentItem.addClass(itemOnClass).parent().next(
								accordionContent).slideDown(
								animationConfig.duration,
								animationConfig.easing, showContentCallback);								
					} else {						
						$currentItem.parent().next(accordionContent).slideUp(
								animationConfig.duration,
								animationConfig.easing, hideContentCallback);
					}	
										

					hideContent();									
				},

				hideContent = function() {

					$currentItem.parent().siblings('h3').each(
							function() {

								$(this).next(accordionContent).slideUp(
										animationConfig.duration,
										animationConfig.easing, function() {
											setTimeout(function() {											
											}, 0);

										});

								$(this).find('a').removeClass(itemOnClass);
							});
				},

				showContentCallback = function() {		
					
					setTimeout(function(){
						if (myScroll)
						{
							myScroll.refresh();
						}                
					}, 0);
				},

				hideContentCallback = function() {					
					$currentItem.removeClass(itemOnClass);
					setTimeout(function(){
						/*if (myScroll)
						{
							myScroll.refresh();
						} */
					}, 0);
				};
				
				$("#accordion").delegate('h3 a', 'click', showItem);
				
				$("#accordion h3").each(function(){
					$(this).data('originalTopOffset', this.offsetTop);
					$(this).data('originalLeftOffset', this.offsetLeft);
					//console.log($(this).data('originalTopOffset') + "  ;  " + $(this).data('originalLeftOffset'));
				});				
			})();
		});