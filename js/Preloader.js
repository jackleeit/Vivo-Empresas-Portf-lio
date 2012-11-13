var Preloader = {
	
	// VARS
	EVENT_IMAGE_CACHE: "Event_ImageCache",
	
	preloader: null,
	
	ldr: null,
	
	posX: 0,
	
	
	// METHODS
	resetPreloaderRef: function() {
		
		this.preloader = $("#preloader");
		this.preloader.css("display", "block");
	},
	
	// Requires an array of objects of the form { src:img_url, ids:img_id }
	cacheImages: function(imagesManifest) {
		
		var preloaderID;
		var FPS = 24;
		
		// 'private functions'
		var preventClick = function(e) {
			e.stopPropagation();
			e.preventDefault();
			e.stopImmediatePropagation();
			return false;
		};
		
		var animatePreloader = function() {
			
			Preloader.preloader.css("background-position-x", -(Preloader.posX*128));
			
			Preloader.posX++;
			if(Preloader.posX >= 45) Preloader.posX = 0;
		};
		
		
		// creating preloader
		if(!this.ldr)
		{
			this.ldr = new createjs.PreloadJS();
			this.ldr.onComplete = function() {
				
				// enable mouse click
				$(window).unbind("click", preventClick);
				
				// removing preloader
				this.ldr = null;
				
				// stop preloader motion
				clearInterval(preloaderID);
				
				// dispatch event
				Preloader.preloader.trigger(Preloader.EVENT_IMAGE_CACHE);
				Preloader.preloader.css("display", "none");
			};
		};
		this.ldr.loadManifest(imagesManifest);
		
		// disable mouse click during image cache
		$(window).bind("click", preventClick);
		
		// preloader motion
		preloaderID = setInterval(animatePreloader, 1000/FPS);
	}
};