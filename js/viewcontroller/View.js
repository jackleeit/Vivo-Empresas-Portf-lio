var View = Backbone.View.extend({
	/*
	 * Initialize with the template-id
	 */
	initialize: function(view) {
		this.view = view;
	},
	
	/*
	 * Get the template content and render it into a new div-element
	 */
	render: function() {
		
		$(this.el).load("pages/" + this.view + ".html", this.viewLoaded);
		return this;
	},
	
	remove: function() {
		
		// remove view content
		$(this.el).remove();
		
		return this;
	},
	
	/*
	 * View events
	 */
	events:
	{
		"click .home_button": "clickHomeButton",
		"click .capa_button": "clickCapaButton",
		"click .capa_main_button": "clickCapaMainButton",
		"click .bt_accordion": "clickAccordion",
		"click .bt_m2m": "clickVideoM2M",
		"click .m2m_title": "closeVideoM2M"
	},
	
	viewLoaded: function(e) {
		
		var content = $(this).children().last();
		if(content)
		{
			/*content.bind("touchmove", function(event) {
				
				var item = $(event.target);
				console.log(item.attr("id"))
				
				if(item.attr("id") != "content_scrollable") event.preventDefault();
			});*/
		};
	},
	
	clickHomeButton: function(e) {
		
		var section = e.target.getAttribute("id");
		var content = document.getElementById("content");
		var videoContent = document.getElementById("video_content");
		var videoFade = document.getElementById("video_fade");
		
		// hide container
		content.style.opacity = 0;
		
		// show video
		videoContent.style.display = "block";
		$(videoFade).stop();
		$(videoFade).css("opacity", 1);
		$(videoFade).delay(250).animate({ opacity:0 }, 500);
		
		// video poster
		if(!Main.currentVideoPoster) Main.currentVideoPoster = document.getElementById("video_poster");
		anim = $(Main.currentVideoPoster);
		anim.stop();
		
		Main.currentVideoPoster.style.backgroundImage = "url('img/videos/" + section + ".jpg')";
		Main.currentVideoPoster.style.opacity = 1;
		Main.currentVideoSection = section;
		
		// video 
		if(Main.videoSupport)
		{
			if(!Main.currentVideo)
			{
				Main.currentVideo = document.getElementsByTagName("video");
				Main.currentVideo[0].addEventListener("canplaythrough", Main.onVideoLoadStart, false);
				Main.currentVideo[0].addEventListener("timeupdate", Main.onVideoUpdate, false);
			};
			
			// loading another video
			Main.currentVideo[0].setAttribute("src", "videos/" + section + ".mp4");
			Main.currentVideo[0].load();
			Main.currentVideo[0].play();
		};
		
		// navigate to video section
		window.location.href = "#" + section;
	},
	
	clickCapaButton: function(e) {
		
		window.location.href = "#" + Main.currentSection + "/" + Main.currentParam + "/" + Main[Main.currentParam][0]["url"];
	},
	
	clickCapaMainButton: function(e) {
		
		window.location.href = "#" + Main.currentSection + "/" + Main.viewParams[0] + "/index";
	},
	
	clickAccordion: function(e) {
		
		var bt = $(e.target);
		var content = bt.next();
		var itemParent = bt.parent().parent();
		var pX = parseInt(bt.css("background-position-y"));
		var delayMotion = false;
		
		
		// closing previous button
		if(Main.currentBtAccordeon && Main.currentBtAccordeon.html() != bt.html())
		{
			var content2 = Main.currentBtAccordeon.next();
			
			content2.stop(false, true);
			content2.slideUp("slow");
			
			Main.currentBtAccordeon.css("background-position-y", "0px");
			Main.currentBtAccordeon.css("color", "#00aaff");
			Main.currentBtAccordeon = null;
			
			delayMotion = true;
		};
		
		// sliding content
		itemParent.stop();
		if(Main.currentID != -1) clearTimeout(Main.currentID);
		
		if(pX == 0)
		{
			if(delayMotion) Main.currentID = setTimeout(Main.onBtAccordeonMotion, 1000, content);
			else Main.onBtAccordeonMotion(content);
			
			//Main.onBtAccordeonMotion(content);
		}
		else
		{
			bt.css("background-position-y", "0px");
			bt.css("color", "#00aaff");
			
			content.slideUp("slow");
			Main.currentBtAccordeon = null;
		};
		
		itemParent.animate({ scrollTop:0 }, 1000);
	},
	
	clickVideoM2M: function(e) {
		
		if(Main.videoSupport)
		{
			var vid = $("#vid_m2m")[0];
			
			$(".video_m2m").css("display", "block");
			vid.play();
			
			Main.currentVideo[0].pause();
			Main.resumePlay = true;
		};
	},
	
	closeVideoM2M: function(e) {
		
		if(Main.videoSupport)
		{
			var content = $(".video_m2m");
			var vid = $("#vid_m2m")[0];
			
			vid.pause();
			content.css("display", "none");
			
			Main.currentVideo[0].play();
			Main.resumePlay = false;
		};
	}
});