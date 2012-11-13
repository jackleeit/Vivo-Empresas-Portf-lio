var Main = {
	
	// sections
	viewSections: [
		"home",
		"empresa",
		"governo",
		"industria",
		"financeiro",
		"comercio",
		"servicos"
	],
	
	// params - level 1
	viewParams: [
		"solucoes_moveis",
		"solucoes_ti",
		"solucoes_dados",
		"solucoes_voz"
	],
	
	// params - level 2
	solucoes_moveis: [
		{ lbl:"p&s de voz corporativa", url:"corporativa" },
		{ lbl:"serviços de gestão", url:"gestao" },
		{ lbl:"vivo direto", url:"direto" },
		{ lbl:"mensageria", url:"mensageria" },
		{ lbl:"vivo internet", url:"internet" },
		{ lbl:"vivo blackberry", url:"blackberry" },
		{ lbl:"m2m", url:"m2m" },
		{ lbl:"vivo gerenciamento integrado", url:"integrado" }
	],
	
	solucoes_ti: [
		{ lbl:"infra de ti", url:"ti" },
		{ lbl:"segurança da informação", url:"informacao" },
		{ lbl:"produtividade ao usuário", url:"usuario" },
		{ lbl:"colaboração", url:"colaboracao" }
	],
	
	solucoes_dados: [
		{ lbl:"ip internet", url:"internet" },
		{ lbl:"vpn", url:"vpn" },
		{ lbl:"smart", url:"smart" },
		{ lbl:"metrolan", url:"metrolan" },
		{ lbl:"serviços internacionais", url:"internacionais" },
		{ lbl:"cdn", url:"cdn" },
		{ lbl:"dial wireless", url:"wireless" }
	],
	
	solucoes_voz: [
		{ lbl:"voz tradicional", url:"tradicional" },
		{ lbl:"voz avançada", url:"avancada" }
	],
	
	currentID: -1,
	
	currentSection: null,
	
	currentParam: null,
	
	currentParam2: null,
	
	currentView: null,
	
	currentBt: null,
	
	currentBt2: null,
	
	currentBtAccordeon: null,
	
	currentVideo: null,
	
	currentVideoPoster: null,
	
	currentVideoSection: null,
	
	resumePlay: null,
	
	controller: null,
	
	videoSupport: !(typeof window.HTMLVideoElement === "undefined"),
	
	initialize: function() {
		
		var loadIndexAssets = function(event) {
			
			// remove listeners
			$(window).unbind("load");
			
			// start index image cache
			var indexManifest = [
				{ src:"img/main/bg_menu.jpg", id:"image0" },
				{ src:"img/main/bg_submenu.jpg", id:"image1" },
				{ src:"img/main/rodape.jpg", id:"image2" },
				{ src:"img/btns/menu/bt_0.jpg", id:"image3" },
				{ src:"img/btns/menu/bt_1.jpg", id:"image4" },
				{ src:"img/btns/menu/bt_2.jpg", id:"image5" },
				{ src:"img/btns/menu/bt_3.jpg", id:"image6" },
				{ src:"img/btns/menu/bt_4.jpg", id:"image7" },
				{ src:"img/btns/menu/bt_5.jpg", id:"image8" },
				{ src:"img/btns/menu/bt_over_1.png", id:"image10" },
				{ src:"img/btns/menu/bt_over_2.png", id:"image11" },
				{ src:"img/btns/menu/bt_over_3.png", id:"image12" },
				{ src:"img/btns/menu/bt_over_4.png", id:"image13" },
				{ src:"img/btns/menu/bt_over_5.png", id:"image14" },
				{ src:"img/btns/submenu/dados/cdn.png", id:"image15" },
				{ src:"img/btns/submenu/dados/internacionais.png", id:"image16" },
				{ src:"img/btns/submenu/dados/internet.png", id:"image17" },
				{ src:"img/btns/submenu/dados/metrolan.png", id:"image18" },
				{ src:"img/btns/submenu/dados/smart.png", id:"image19" },
				{ src:"img/btns/submenu/dados/vpn.png", id:"image20" },
				{ src:"img/btns/submenu/dados/wireless.png", id:"image21" },
				{ src:"img/btns/submenu/moveis/blackberry.png", id:"image22" },
				{ src:"img/btns/submenu/moveis/corporativa.png", id:"image23" },
				{ src:"img/btns/submenu/moveis/direto.png", id:"image24" },
				{ src:"img/btns/submenu/moveis/gestao.png", id:"image25" },
				{ src:"img/btns/submenu/moveis/integrado.png", id:"image26" },
				{ src:"img/btns/submenu/moveis/internet.png", id:"image27" },
				{ src:"img/btns/submenu/moveis/m2m.png", id:"image28" },
				{ src:"img/btns/submenu/moveis/mensageria.png", id:"image29" },
				{ src:"img/btns/submenu/ti/colaboracao.png", id:"image30" },
				{ src:"img/btns/submenu/ti/informacao.png", id:"image31" },
				{ src:"img/btns/submenu/ti/ti.png", id:"image32" },
				{ src:"img/btns/submenu/ti/usuario.png", id:"image33" },
				{ src:"img/btns/submenu/voz/avancada.png", id:"image34" },
				{ src:"img/btns/submenu/voz/tradicional.png", id:"image35" },
				{ src:"img/btns/content/bg_accordion.png", id:"image36" },
				{ src:"img/btns/content/bt_capa.png", id:"image37" },
				{ src:"img/btns/content/bt_capa_2.png", id:"image38" },
				{ src:"img/btns/content/bt_capa_3.png", id:"image39" },
				{ src:"img/content/bg_home.jpg", id:"image40" },
				{ src:"img/content/bg_empresa.jpg", id:"image41" },
				{ src:"img/content/bg_tx_capas.png", id:"image42" },
				{ src:"img/videos/governo.jpg", id:"image43" },
				{ src:"img/videos/industria.jpg", id:"image44" },
				{ src:"img/videos/financeiro.jpg", id:"image45" },
				{ src:"img/videos/comercio.jpg", id:"image46" },
				{ src:"img/videos/servicos.jpg", id:"image47" },
				{ src:"img/content/tit_comercio.png", id:"image48" },
				{ src:"img/content/tit_financeiro.png", id:"image49" },
				{ src:"img/content/tit_governo.png", id:"image50" },
				{ src:"img/content/tit_industria.png", id:"image51" },
				{ src:"img/content/tit_servicos.png", id:"image52" },
				{ src:"img/btns/home/comercio.gif", id:"image53" },
				{ src:"img/btns/home/financeiro.gif", id:"image54" },
				{ src:"img/btns/home/governo.gif", id:"image55" },
				{ src:"img/btns/home/industria.gif", id:"image56" },
				{ src:"img/btns/home/servicos.gif", id:"image57" }
			];
			
			// cache images and start app
			Preloader.resetPreloaderRef();
			Preloader.preloader.bind(Preloader.EVENT_IMAGE_CACHE, Main.show);
			Preloader.cacheImages(indexManifest);
		};
		
		// on document load, start asset load
		$(window).bind("load", loadIndexAssets);
	},
	
	show: function(event, param) {
		
		/*try {
			console.log("[ START APP ]");
		}
		catch(e)
		{};*/
		
		// unbind event
		Preloader.preloader.unbind(Preloader.EVENT_IMAGE_CACHE, Main.show);
		
		// creating 'controller'
		// navigation/router (backbone) instance 
		controller = new Controller($("#content"));
		Backbone.history.start();
	},
	
	onVideoLoadStart: function(event) {
		
		Main.currentVideo[0].currentTime = 0;
		
		$(Main.currentVideoPoster).stop();
		$(Main.currentVideoPoster).delay(45).animate({ opacity:0 }, 100);
	},
	
	onVideoUpdate: function(event) {
		
		var video = event.target;
		var currentPos = video.currentTime;
		var maxduration = video.duration;
		var percentage = 100 * currentPos/maxduration;
		
		if(percentage >= 99)
		{
			var videoSrc = video.getAttribute("src");
			
			if(videoSrc.indexOf("loop") == -1)
			{
				Main.currentVideoPoster.style.opacity = 1;
				Main.currentVideoPoster.style.backgroundImage = "url('img/videos/" + Main.currentVideoSection + ".jpg')";
				
				video.setAttribute("src", "videos/" + Main.currentVideoSection + "_loop.mp4");
				video.load();
				video.play();
			}
			else
			{
				video.currentTime = 0.1;
				video.play();
			};
		};
	},
	
	onBtAccordeonMotion: function(content) {
		
		var h = content.height();
		var bt = content.prev();
		
		content.stop(false, true);
		content.css("display", "block");
		content.height(0);
		content.animate({ height:h }, 1000);
		
		bt.css("background-position-y", "-44px");
		bt.css("color", "#fff");
		
		Main.currentBtAccordeon = bt;
	}
};

// init app
Main.initialize();