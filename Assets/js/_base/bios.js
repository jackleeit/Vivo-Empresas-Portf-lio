/**
 * EXTEND PROTOTYPE
 */
 
/*
* @member String
* @method [static] patchId
* @param {string} string
* @param {object} replace
* @param {regexp} format ?
* @return {string} string
* @description Altera uma string aplicando novo conteudo
*/
String.prototype.strpl = function (data, format) {
	format = format || /\{([A-z0-9\.]*)\}/gi;

	return decodeURI(this).replace(format, function (o, a) {
		var ns = a.split('.');
		var sc = data;

		for (var x = 0; x < ns.length; x++) {
			sc = sc ? sc[ns[x]] : '';
		}

		var tp = (typeof sc).toLowerCase();

		return (tp != 'function') ? sc : sc.apply(sc, [data, a]);
	});
};
/*
* @member String
* @method [static] sfmt
* @param {string} string
* @param {string} replace ...
* @description Altera uma string aplicando novo conteudo, sem especificar chave
*/
String.prototype.sfmt = function () {
	for (var x = 0, sfmt = []; x < arguments.length; x++)
		sfmt[x] = arguments[x];

	return this.strpl(sfmt);
};
/*
* @member String
* @method [static] patchId
* @param {string} string
* @return {string} clean
* @description Limpa espaços em branco do comeco e fim de uma string
*/
String.prototype.trim = function (str) {
    str = str || this;
    return $istype(str, 'string') ? str.replace(/^\s+|\s+$/g, "") : str;
};




/*
* @member Array | Object
* @method [static] addHandler
* @param {function} handler
* @description Varre um array ou objeto
*/
$foreach = function (obj, fn) {
    var returning = null;

    switch ($type(obj)) {
        case "array":
        case "collection":
            returning = [];
            for (var i = 0; i < obj.length; i++)
                returning[i] = fn.apply(obj, [obj[i], i]);
            break;
        case "object":
            returning = {};
            for (var i in obj)
                returning[i] = fn.apply(obj, [obj[i], i]);
            break;
    }

    return returning;
};

Array.prototype.foreach = function (fn) {
    return $foreach(this, fn);
}

/*
* @member All
* @method [static] clone
* @param {object} object
* @return {object} object
* @description Clona um objeto e todo seu conteudo
*/
$clone = function (obj) {
	if (obj == null || typeof obj != "object") return obj;
	if (obj.constructor != Object && obj.constructor != Array) return obj;
	if (obj.constructor == Date || obj.constructor == RegExp || obj.constructor == Function ||
		obj.constructor == String || obj.constructor == Number || obj.constructor == Boolean)
		return new obj.constructor(obj);

	var to = new obj.constructor();

	for (var name in obj) {
		to[name] = $clone(obj[name], null);
	}

	return to;
};

$option = function(update, defaults){
	var obj = {};

	for (var key in defaults) {
	    if (update[key] != undefined)
	        obj[key] = update[key]
	    else
	        obj[key] = defaults[key];
	}
	
	return obj;
}


$type = function (item) {
	if (item == null) return 'null';

	if (item.nodeName) {
		if (item.nodeType == 1) return 'element';
		if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
	} else if (typeof item.length == 'number') {
		if (item.callee) return 'arguments';
		if (!item.split && ('item' in item)) return 'collection';
		if (Object.prototype.toString.apply(item) === '[object Array]') return 'array';
	}

	return (typeof item).toLowerCase();
};

$istype = function (obj, type) {
	return type && ($type(obj) == type.toLowerCase());
};



/**
 * Class
 * @author Felipe Pupo Rodrigues
 * @method Class
 * @namespace Sarue
 * @param {Object} propertys
 * @param {Object} abstracts
 * @return {Instance}
 */
function Class(propertys, abstracts){
	var counter = 0;
	
	abstracts = $clone(abstracts);
	
	/**
	 * Constructor
	 * @author Felipe Pupo Rodrigues
	 * @method Constructor
	 * @namespace Sarue.Class
	 * @return {Instance}
	 * @classDescription method for constructor a construct class.
	 */
	function Constructor(){
		/**
		 * Instance
		 * @author Felipe Pupo Rodrigues
		 * @method Instance
		 * @namespace Sarue.Class.Constructor
		 * @return {UserDefine}
		 * @classDescription Instance of constructor class
		 */
		
		var insPropertys = $clone(propertys);
			
		function Instance(opt){
			//set new options
			//set construct default options
		    if (Constructor.defaults && opt){
				Instance._options(opt, true);
			}else {
				//set instance default options
			    if (Instance.defaults && opt) 
					Instance._options(opt);
			}
			
			//call constructor method
			return Instance.construct.apply(Instance, arguments); 
		}
		
		Instance.prototype.constructor = Instance.self = Constructor;
		Instance.prototype.UID = ++counter;
		
		//add magic methods;
		for(var key in magicMethods)
			addProperty(key, magicMethods, Instance);
		
		//add class propertys;
		for(key in insPropertys)
			addProperty(key, insPropertys, Instance);
		
		//extend new parent instance
		if (Instance.parent) {
			Instance.parent = new Instance.parent(Class.EXTEND);
			Instance.parent.prototype._this = Instance;
			
			var prototype = Instance.parent.prototype.constructor.prototype.propertys;
			
			//delete propertys
			for(key in prototype){
				if (typeof prototype[key] != 'function' && (!prototype[key] || prototype[key] == Instance[key])) {
					delete Instance.parent[key];
				}
			}
		}
		
		//call constructor
		if(arguments[0] !== Class.EXTEND)
			Instance.apply(Instance, arguments);
		
		
		Constructor.prototype.instances.push(Instance);
		
		return Instance;
	}
	
	/**
	 * addProperty
	 * @author Felipe Pupo Rodrigues
	 * @method addProperty
	 * @namespace Sarue.Class
	 * @param {String} key
	 * @param {Object} from
	 * @param {Constructor, Instance} to
	 * @classDescription Add real Methods and Propertys
	 */
	function addProperty(key, from, to){
		
		var isUpper = key === key.toUpperCase();
		var ignoreCase = (['prototype', 'options', 'parent', 'defaults']).toString().indexOf(key) != -1;
		var classObject = from[key] && (from[key] === Constructor || from[key] === Class || (from[key]['prototype'] && from[key]['prototype']['constructor'] && from[key]['prototype']['constructor'] === Class));
		
		if (typeof(from[key]) == "function" && !!from[key].call && !classObject) {
			
			var method = from[key].toString().replace('{', '{ var such = this, parent = this.parent, options = this.options, self = this.'+key+'.prototype.self, caller = this.'+key+'.prototype.callee;');
				method = Function('return ' + method)();
			
			/**
			 * Method
			 * @return {Method}
			 */
			function Method()
			{
				try {
					//search actual scope
					while (to.prototype._this && to.prototype._this !== to) {
						to = to.prototype._this;
					}
					
					//ignore magic methods
					if (key != 'construct' && magicMethods[key]) 
						return method.apply(to, arguments);
					
					//intercept methods call
					if (!to['_call'] || to._call.apply(to, [key, arguments, this]) && to['_endcall']){
					
						to[key].prototype.callee = this;
						to[key].prototype.self = Constructor;
						
						return method.apply(to, arguments);//to._endcall.apply(to, [key, method.apply(to, arguments), this]);
					}
					
					return null;
				}catch(e){
					var ers = to['_error'] ? to._error.apply(to, [e, key, arguments, from]) : null;
					
					if(ers == null){
					    throw new Error('Error in Method: ' + key + '\n' + 'Instance UID: ' + counter + '\n' + 'Message: ' + e.message + '\n' + 'Line: ' + e.lineNumber);
					}
					return ers;
				};
			};
			
			if (!ignoreCase && isUpper) {
				throw new Error('METHOD_IS_CAMELCASE [' + key + ']');
				
				return null;
			};
			
			to[key] = Method;
			
			return Method;
		};
		
		if (!classObject && !ignoreCase && !isUpper) {
			throw new Error('PROPERTY_IS_UPPERCASE [' + key + ']');
			
			return null;
		};
		
		to[key] = from[key];
	}
	
	/**
	 * Magic Methods, add in all class
	 */
	var magicMethods = {
	    construct: function () { },

	    _scopes: function (iterator) {
	        var scope = this;

	        while (scope) {
	            if (scope && iterator)
	                iterator(scope);
	            scope = scope.parent;
	        }
	    },

	    _call: function (key, args) {
	        return true;
	    },
	    _endcall: function (key, result) {
	        return result;
	    },
		_implement: function(parent){
			
			for(var key in parent.prototype.propertys){
				if (!this[key]) 
					addProperty(key, parent.prototype.propertys, this);
				else if(typeof parent.prototype.propertys[key] == 'function'){
					var original = this[key], fn = parent.prototype.propertys[key], scope = this;
					var obj = {};
						obj[key] = function(){
						original.apply(scope, arguments);
						fn.apply(scope, arguments);
					};
					
					addProperty(key, obj, this);
				}
			}
				
			for(var key in parent.prototype.abstracts){
				if (!this[key]) 
					addProperty(key, parent.prototype.abstracts, this.self);
				else if(typeof parent.prototype.abstracts[key] == 'function'){
					var original = this.self[key], fn = parent.prototype.abstracts[key], scope = this.self;
					var obj = {};
						obj[key] = function(){
							original.apply(scope, arguments);
							fn.apply(scope, arguments);
						};
					
					addProperty(key, obj, this);
				}
			}
		},
	    _options: function (opt, abstracts) {
			this.options = $option(opt || {}, (abstracts ? this.self.defaults : this.defaults));
	    },
	    _intercept: function (obj) {
	        for (var key in obj) {
	            var parent = this[key];
	            var method = addProperty(key, obj, this);

	            if (method)
	                method[key] = parent;
	        }
	    },
	    _error: function (e) {
	        return null;
	    }
	}
	
	
	Constructor.prototype.constructor = Class;
	Constructor.prototype.propertys = propertys;
	Constructor.prototype.abstracts = abstracts;
	Constructor.prototype.instances = [];
	
	/**
	 * implement
	 * @author Felipe Pupo Rodrigues
	 * @method implement
	 * @namespace Sarue.Class.Constructor
	 * @param {Object} propertys
	 * @return {Constructor}
	 */
	addProperty('_implement', {
		_implement: function(parent){
			Constructor = Class.implement(parent, Constructor.prototype.propertys, Constructor.prototype.abstracts);
			return Constructor;
		}
	}, Constructor);
	
	for(var key in magicMethods)
		if(key == 'construct' || key == '_call' || key == '_endcall' || key == '_error')
			addProperty(key, magicMethods, Constructor);
	
	for(var key in abstracts)
		addProperty(key, abstracts, Constructor);
	
	return Constructor.construct.apply(Constructor, []) || Constructor;
};

//Unique Constant for check extend;
Class.EXTEND = {};

/**
 * Extend
 * @author Felipe Pupo Rodrigues
 * @method Extend
 * @namespace Sarue.Class
 * @param {Class} class
 * @param {Object} propertys
 * @param {Object} abstract
 * @return {Constructor}
 * @classDescription Extend property and return a new constructor
 */
Class.extend = function(parent, propertys, abstracts){
	if(!parent || !parent.prototype)
		return;
		
	propertys = propertys || {};
	abstracts = abstracts || {};
	
	//merge extend propertys
	for(var key in parent.prototype.propertys)
		if(propertys[key] === undefined)
			propertys[key] = parent.prototype.propertys[key];
	
	//merge extend abstracts propertys
	for(var key in parent.prototype.abstracts)
		if(abstracts[key] === undefined)
			abstracts[key] = parent.prototype.abstracts[key];
	
	propertys.parent = parent;
	
	//create new constructor
	return new Class(propertys, abstracts);
}

/**
 * Implement
 * @author Felipe Pupo Rodrigues
 * @method Implement
 * @namespace Sarue.Class
 * @param {Class} class
 * @param {Object} propertys
 * @param {Object} abstract
 * @return {Constructor}
 * @classDescription Implement propertys and return a new constructor
 */
Class.implement = function(parent, propertys, abstracts){
	if(!parent) return null;
	
	if(parent.length && parent.length > 1){
		var implement, klass;
		
		for (var c = 0; c < parent.length; c++) {
			klass = parent[c];
			
			if(klass.prototype.constructor !== Class)
				klass = klass[klass.prototype.constructor];
			
			implement = new Class.implement(klass, propertys, abstracts);
			propertys = implement.prototype.propertys;
			abstracts = implement.prototype.abstracts;
		}
		
		return implement;
	}
	
		
	/**
	 * mergeProperty
	 * @method mergeProperty
	 * @namespace Sarue.Class.implement
	 * @param {String} key
	 * @param {Object} original
	 * @param {Object} implement
	 * @return {Object}
	 * @classDescription Merge methods/replace propertys
	 */
	function mergeProperty(key, original, implement){
		if (typeof implement[key] == 'function') {
			var parent = original[key] || function(){};
			var method = implement[key] || function(){};
			
			implement[key] = function(){
				return  method.apply(this, arguments) || parent.apply(this, arguments);
			}
			
			return;
		}
		
		if (implement[key] === undefined) 
			implement[key] = original[key];
	}
	
	propertys = propertys || {};
	abstracts = abstracts || {};
	
	//implement new propertys
	if (parent.prototype) {
		for (var key in parent.prototype.propertys) 
			mergeProperty(key, parent.prototype.propertys, propertys);
		
		//implement new abstracts propertys
		for (var key in parent.prototype.abstracts) 
			mergeProperty(key, parent.prototype.abstracts, abstracts);
	}
	
	//create new constructor
	return new Class(propertys, abstracts);
}
/**
 * exists
 * @author Felipe Pupo Rodrigues
 * @method exists
 * @namespace Sarue.Class
 * @param {String} namespace
 * @param {Object,Namespace} scope
 * @return {Boolean}
 */
Class.exists = function(name, scope){
	name = name.split('.');
	scope = scope || window;
	
	for (var x = 0, ns; ns = name[x]; x++) {
		if (!scope[ns]) 
			return false;
		scope = scope[ns];
	}
	
	return scope;
}


Class.namespace = function(nspace, scope, construct){
	nspace = typeof nspace == 'string' ? nspace.split('.') : nspace;
	scope = scope || window;
	
	for (var x = 0, n; n = nspace[x]; x++) {
		if(!scope[n])
			scope[n] = (construct && (x+1) >= nspace.length) ? new construct() : new Class();
			
		scope = scope[n];
	}
	
	return scope
}