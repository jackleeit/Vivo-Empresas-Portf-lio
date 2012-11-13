// view manager
var Controller = Backbone.Router.extend({
	
	hasVideo:false,
	
	hasSubmenu:false,
	
	routes: {
		"*_section/*_splat": "manageTabs",
		"*else": "manageTabs"
	},
	
	initialize: function(element){
		
		// storing view container
		this.el = element;
		
		// assembling main view - buttons
		for(var i=0; i<6; i++)
		{
			var bt = $("#bt_" + i);
			
			// menu
			bt.css("background-image", "url('img/btns/menu/bt_" + i + ".jpg')");
			bt.bind("click", (i < 2 ? this.onBtViewClick : this.onBtParamClick));
		};
		
		// assembling main view - menu/submenu/footer
		$("#menu").css("background-image", "url('img/main/bg_menu.jpg')");
		$("#submenu").css("background-image", "url('img/main/bg_submenu.jpg')");
		$("#footer").css("background-image", "url('img/main/rodape.jpg')");
		
		// prevent scrolling
		$("div:not(#content)").bind("touchmove", function(event) {
			event.preventDefault();
		});
		
		// directing always to home
		window.location.href = "#home";
	},
	
	manageTabs: function(_section, _splat){
		
		var animateContentDiv = false;
		
		// beginning conditional
		if(_section == "" || _section == undefined)
		{
			window.location.href = "#home";
			return;
		};
		
		// handling views
		if(Main.currentSection != _section || (_section == "empresa" && _splat == undefined && Main.currentParam != null))
		{
			// remove previous view
			if (Main.currentView)
			{
				Main.currentView.remove();
				Main.currentView = null;
			};
			
			// remove video
			if(_section == "home" && this.hasVideo)
			{
				$("#video_content").css("display", "none");
				if(Main.videoSupport) Main.currentVideo[0].pause();
				
				Main.currentVideoSection = null;
				this.hasVideo = false;
			};
			
			// remove submenu
			if(this.hasSubmenu)
			{
				$("#submenu_content").empty();
				if(Main.currentBt2) Main.currentBt2 = null;
				
				this.changeContentPosY(false);
				this.hasSubmenu = false;
			};
			
			// place video, if necessary (or remove it)
			if(_section != "home") this.hasVideo = true;
			
			// show/hide 'submenu' items
			this.showHideMenuItems(_section != "home");
			
			
			// creating new view - if there´s no param view to be created
			if(_splat == undefined || _splat == "" || _splat == null)
			{
				view = new View(_section);
				animateContentView = true;
			};
			
			Main.currentSection = _section;
			Main.currentParam = null;
			Main.currentParam2 = null;
		};
		
		// handling params
		if(_splat != undefined && _splat != "" && _splat != null)
		{
			var arr, param, param2;
			arr = _splat.split("/");
			param = arr[0];
			param2 = arr[1];
			
			if((Main.currentParam != param && Main.currentParam2 == "index") || Main.currentParam2 != param2)
			{
				var changeSubmenu = (Main.currentParam != param);
				
				// creating new view
				view = new View("menu/" + param + "/" + param2);
				animateContentView = true;
				
				// storing current parameters
				Main.currentParam = param;
				Main.currentParam2 = param2;
				
				// showing submenu
				if(changeSubmenu)
				{
					if(!this.hasSubmenu) this.changeContentPosY(true);
					this.showSubmenu();
				};
			};
		};
		
		// move the view element into the DOM (replacing the old content)
		if(animateContentView)
		{
			$(this.el).stop();
			$(this.el).css("opacity", 0);

			this.el.html(view.el);
			view.render();
			
			// fade in
			$(this.el).animate({ opacity:1 }, 1000);
			
			// remove bt accordeon reference
			clearTimeout(Main.currentID);
			Main.currentBtAccordeon = null;
		};
		
		
		// storing currentview
		Main.currentView = view;
		
		// managing buttons
		this.setActiveEntry();
		
		/*try {
			console.log("[ section: ", _section, " / splat: ", _splat, " ]");
		}
		catch(e)
		{};*/
	},
	
	onBtViewClick: function(event) {
		
		var index = $(this).attr("id").split("_")[1];
		window.location.href = "#" + Main.viewSections[index];
	},
	
	onBtParamClick: function(event) {
		
		var index = parseInt($(this).attr("id").split("_")[1]) - 2;
		window.location.href = "#" + Main.currentSection + "/" + Main.viewParams[index] + "/index";
	},
	
	onBtParam2Click: function(event) {
		
		var id;
		var bt = $(event.target);
		
		if(Main.resumePlay)
		{
			Main.currentVideo[0].play();
			Main.resumePlay = false;
		};
		
		id = (bt.attr("id") == undefined || bt.attr("id") == null) ? bt.parent().attr("id") : bt.attr("id");
		window.location.href = "#" + Main.currentSection + "/" + Main.currentParam + "/" + id;
	},
	
	showHideMenuItems: function(show) {
		
		for(var i=1; i<6; i++) { $("#bt_" + i).css("display", show ? "block" : "none"); };
	},
	
	showSubmenu: function() {
		
		var bt, tx, txH, arr, section;
		var px = 0;
		
		// removing previous clicked bt
		if(Main.currentBt2) Main.currentBt2 = null;
		
		// empty container
		$("#submenu_content").empty();
		
		// placing new buttons
		arr = Main[Main.currentParam];
		section = Main.currentParam.split("_")[1];
		for (var i=0; i < arr.length; i++)
		{
			bt = $("<div id='" + arr[i]["url"] + "' class='submenu_button'><p>" + (arr[i]["lbl"]).toUpperCase() + "</p></div>");
			bt.css("background-image", "url('img/btns/submenu/" + section + "/" + arr[i]["url"] + ".png')");
			bt.bind("click", this.onBtParam2Click);
			$("#submenu_content").append(bt);
			
			tx = $("#" + arr[i]["url"] + " > p");
			txH = tx.height();
			tx.css("margin-top", (36-txH)/2);
			
			px += bt.outerWidth(true);
		};
		
		// apply margin
		$("#submenu_content").css("margin-left", -px/2);
		
		// change flag
		this.hasSubmenu = true;
	},
	
	changeContentPosY: function(lower) {
		
		$("#submenu").stop();
		$("#submenu").animate({ marginTop:(lower ? "80px" : "0px") }, 500 );
	},
	
	setActiveEntry: function() {
		
		var index, bt;
		
		// cleaning previous bt
		if(Main.currentBt)
		{
			Main.currentBt.css("background-image", "url('img/btns/menu/" + Main.currentBt.attr("id") + ".jpg')");
			Main.currentBt = null;
		};
		
		// changing bt background
		if(Main.currentSection == "empresa" && Main.currentParam == null)
		{
			index = Main.viewSections.indexOf(Main.currentSection);
			
			bt = $("#bt_" + index);
			bt.css("background-image", "url('img/btns/menu/bt_over_" + index + ".png')");
			Main.currentBt = bt;
		}
		else if(Main.currentParam)
		{
			index = Main.viewParams.indexOf(Main.currentParam) + 2;
			
			bt = $("#bt_" + index);
			bt.css("background-image", "url('img/btns/menu/bt_over_" + index + ".png')");
			Main.currentBt = bt;
		};
		
		// submenu buttons
		if(Main.currentBt2)
		{
			Main.currentBt2.css("background-position-y", "0px");
			Main.currentBt2.children().css("color", "#005580");
			Main.currentBt2 = null;
		};
		
		if(Main.currentParam2 && Main.currentParam2 != "index")
		{
			bt = $("#" + Main.currentParam2);
			bt.css("background-position-y", "-36px");
			bt.children().css("color", "#fff");
			Main.currentBt2 = bt;
		};
	}
});