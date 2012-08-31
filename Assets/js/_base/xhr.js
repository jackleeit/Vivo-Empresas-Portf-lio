XHR = new Class({
	REQUEST	: {},
	
	construct: function(options)
	{
		such.initializeRequest();
	},
	
	initializeRequest : function()
	{
		such.REQUEST = such.self.getXmlHttp();
      	such.REQUEST.onreadystatechange = such.onStateChange;
		
		var data = such.self.parseData(such.options.data, such.options.noCache);
		
		if(data && such.options.method.toUpperCase() == 'GET'){
			var url = (such.options.url + ((such.options.url.search(/\?/) != -1) ? '&' : '?')) + data;
			var data = null;
		}
		else{
			var url = such.options.url;
		}
		
		such.REQUEST.open(such.options.method.toUpperCase(), url, such.options.async);
		
		if (such.options.urlEncoded) {
			var rpl =  such.options;
				rpl.dataLength = data ? data.length : '';
				
			for (var key in such.options.headers) {
				if($istype(such.options.headers[key], 'string'))
					such.setRequestHeader(key, such.options.headers[key].strpl(rpl));
			}
		}
		
		such.self.REQUESTS.push(such.REQUEST);
		
		such.send(data);
	},
	
	setRequestHeader : function(key, value)
	{
		try {
			return (such.REQUEST && value) ? such.REQUEST.setRequestHeader(key, value) : null;
		}catch(e){
			return null;
		}
	},
	
	onStateChange : function(e){
		switch (such.REQUEST.readyState)
		{
		 case 0:
		    such.self.wait(such.options.timeout);
		    such.onUninitialize();
		    break;
		                       
		 case 1:
		    such.self.wait(such.options.timeout);
		    such.onLoading();
		    break;
		                       
		 case 2:
		    such.self.wait(such.options.timeout);
		    such.onLoaded();
		    break;
		               
		 case 3:
		    such.self.wait(such.options.timeout);
		    such.onInteractive();
		    break;
		                       
		 case 4:
		    if (such.REQUEST.status == 200)
		       such.onSuccess();
		    else
		       such.onFailure();
			   
		    such.onComplete();
		    break;
		}
	},
	
	send : function(data)
	{
		return (such.REQUEST) ? such.REQUEST.send(data) : null;
	},
	
	close : function()
	{
		return (such.REQUEST) ? such.REQUEST.abort() : null;
	},
	
	getResponseXML : function()
	{
		return (such.REQUEST) ? such.REQUEST.responseXML : null;
	},
	
	getResponseHTML : function()
	{
		return DOM.toHTML(such.getResponseText());
	},
	
	getResponseText : function()
	{
		return (such.REQUEST) ? such.REQUEST.responseText : null;
	},
	
	onUninitialize : function()
	{
		such.options.onUninitialize.apply(such);
	},
	onLoading : function()
	{
		such.options.onLoading.apply(such);
	},
	onLoaded : function()
	{
		such.options.onLoaded.apply(such);
	},
	onInteractive : function()
	{
		such.options.onInteractive.apply(such);
	},
	onSuccess : function()
	{
		such.options.onSuccess.apply(such, [such.getResponseText(), such.getResponseXML()]);
	},
	onFailure : function()
	{
		var code = such.REQUEST.status;
		
		such.options.onFailure.apply(such, [code]);
		
		if(such.options.onErrors[code])
			such.options.onErrors[code].apply(such);
	},
	onComplete: function()
	{
		such.options.onComplete.apply(such);
	}
	
},{
	REQUESTS: [],
	
	defaults : {
		url: null,
		data: null,
		method: 'GET',
		encoding: 'UTF-8',
		timeout: 0,
		noCache: true,
		urlEncoded:true,
		async:true,
		
		onUninitialize 	: function(){},
		onLoading 		: function(){},
		onLoaded  		: function(){},
		onInteractive 	: function(){},
		onSuccess 		: function(){},
		onFailure 		: function(){},
		onComplete 		: function(){},
		onErrors		: {},
		
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset={encoding}',
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
			'Content-length': '{dataLength}'
		}
	},
	
	setDefault: function(defaults){
		console.info(such);
		for (var key in defaults) {
			such.defaults[key] = defaults[key];
		}
	},
	
	getXmlHttp: function(){
		if (window.XMLHttpRequest)
			var xmlHttp = new XMLHttpRequest();
		
		else if(window.ActiveXObject)
			var xmlHttp = ActiveXObject('Microsoft.XMLHTTP');
			
		return xmlHttp;
	},
	
	parseData: function(parans, noCache){
		var data = [];
		parans = parans || {};
		
		if(noCache)
			parans.noCache = new Date().getTime();
		
		for(var key in parans)
			data.push(key + '=' + parans[key])
			
		return data.join('&');
	},
	
	wait: function(timeout){
		window.setTimeout("void(0)", timeout);
	}
});