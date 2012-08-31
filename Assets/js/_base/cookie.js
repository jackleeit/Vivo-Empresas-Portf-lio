/*
 * @class Cookie
 * @description Manipulador de cookie
 */
Cookie = new Class({},{
	FORMAT: '{name}={value}; expires={expires}; path={path}; domain={domain}{secure}',
	
	/*
	 * @member Cookie
	 * @method [static] set
	 * @param {string} name
	 * @param {string} value
	 * @param {number} expires
	 * @param {string} path
	 * @param {string} domain
	 * @param {boolean} secure
	 * @description Seta o valor do cookie
	 */
	set: function(name, value, expires, path, domain, secure)
	{
		if( expires )
		{
			var date = new Date();
				date.setTime( date.getTime() + (expires*86400000) );
				
			var expires = "" + date.toGMTString();
		}
		
		document.cookie = such.FORMAT.strpl({
			name: name || '',
			value: escape(value) || '',
			expires: expires || '',
			path: path || '/',
			domain: domain || '',
			secure: secure ? '; secure' : ''
		});
	},
	
	/*
	 * @member Cookie
	 * @method [static] set
	 * @param {string} name
	 * @return {string} value
	 * @description Pega o valor do cookie
	 */
	get: function(name){
		if( !such.exists(name) ) return;
 
		var nameEQ = name + '=';
		var cookies = document.cookie.split(';');
		
		for(var current in cookies )
		{
			var c = cookies[current].replace(/^\s+/, '');
			
			if (c.indexOf(nameEQ) == 0) {
				return c.substr(nameEQ.length);
			}
		}
	},
	
	/*
	 * @member Cookie
	 * @method [static] del
	 * @param {string} name
	 * @description Deleta o cookie
	 */
	del: function(name){
		such.set(name, '', 0);
	},
	
	/*
	 * @member Cookie
	 * @method [static] exists
	 * @param {string} name
	 * @return {boolean} exists
	 * @description Verifica se existe o cookie
	 */
	exists: function(name){
		return ( document.cookie.indexOf(name + '=') != -1 );
	}
});
