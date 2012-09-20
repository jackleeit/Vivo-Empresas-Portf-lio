Math.easeInQuad = function(t, b, c, d) {
	return c * (t /= d) * t + b;
};

Math.easeOutQuad = function (t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
};

$(document)
		.ready(
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
							if (!$currentItem.hasClass(itemOnClass)) {
								
								$currentItem.addClass(itemOnClass).parent()
										.next(accordionContent).slideDown(
												animationConfig.duration,
												animationConfig.easing,
												showContentCallback);

								var $h3 = $currentItem.parent();

								if (myScroll
										&& ($h3.get(0).offsetTop > maxAvailableHeight)) {
									
									var intervalo;									
									var t = new Date();
									
									function createTween(begin, finish,
											duration, funcao) {
										duration = duration * 32;
										var _c;
										var change = finish - begin;
										var time = 0;
										intervalo = setInterval(function() {
											_c = funcao(time++, begin, change,
													duration);
											myScroll.scrollTo(0, _c * -1, 5);
											if (time > duration)
												clearInterval(intervalo);
										}, 33);
									}
									
									createTween($h3.get(0).offsetTop, $h3
											.data('originalTopOffset'), 4,
											Math.easeOutQuad);
									/*
									 * var now = 0; var end = 100; var step =
									 * 50; var fim =
									 * $h3.data('originalTopOffset'); var inicio =
									 * $h3.get(0).offsetTop; var diferencia =
									 * inicio - fim;
									 * 
									 * var interval = setInterval(function(){
									 * step--;
									 * 
									 * now = (((end/100) * step)); bounce = (now -
									 * (now/21));
									 * 
									 * myScroll.scrollTo(0, ((((diferencia /
									 * 100) * bounce) + fim)-10) * -1, 5);
									 * 
									 * if(step <= 0) clearTimeout(interval); },
									 * 20) }
									 */
								}
							} else {
								$currentItem.parent().next(accordionContent)
										.slideUp(animationConfig.duration,
												animationConfig.easing,
												hideContentCallback);
							}

							hideContent();
						},

						hideContent = function() {

							$currentItem.parent().siblings('h3').each(
									function() {

										$(this).next(accordionContent).slideUp(
												animationConfig.duration,
												animationConfig.easing,
												function() {
													setTimeout(function() {
													}, 0);

												});

										$(this).find('a').removeClass(
												itemOnClass);
									});
						},

						showContentCallback = function() {

							setTimeout(function() {
								if (myScroll) {
									myScroll.refresh();
								}
							}, 0);
						},

						hideContentCallback = function() {
							$currentItem.removeClass(itemOnClass);
							setTimeout(function() {
								/*
								 * if (myScroll) { myScroll.refresh(); }
								 */
							}, 0);
						};

						$("#accordion").delegate('h3 a', 'click', showItem);

						$("#accordion h3").each(
								function() {
									$(this).data('originalTopOffset',
											this.offsetTop);
									$(this).data('originalLeftOffset',
											this.offsetLeft);
								});
					})();
				});