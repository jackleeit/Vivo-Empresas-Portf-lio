/**
 * EXTEND PROTOTYPE
 */
 
if ( !window.Element ) {
    Element = function() {};
	Element.prototype._HackSupport = true;
	
	var __createElement = document.createElement;
	document.createElement = function(tagName)
	{
			var element = __createElement(tagName);
			for(var key in Element.prototype)
					element[key] = Element.prototype[key];
			return element;
	}

	var __getElementById = document.getElementById
	document.getElementById = function(id)
	{
			var element = __getElementById(id);
			for(var key in Element.prototype)
					element[key] = Element.prototype[key];
			return element;
	}
}

/*
* @member Element
* @method [static] addHandler
* @param {object} obj
* @param {string} evnt
* @param {function} handler
* @description Adiciona um evento em um objeto
*/
Element.prototype.addEvent = function (evnt, handler) {
	
	var element = this;
	
	if (element.addEventListener) { // W3C DOM
		return element.addEventListener(evnt.replace(/^on/, ''), handler, false);
	} else if (element.attachEvent) { // IE DOM
		return element.attachEvent(/^on/.test(evnt) ? evnt : ('on' + evnt), function(e){
			return handler.apply(element, arguments);
		});
    }else {
		if (element[evnt]) {
			var origHandler = element[evnt];
			element[evnt] = function (evt) {
				origHandler.apply(element, arguments);
				return handler.apply(element, arguments);
			}
		} else {
			element[evnt] = function (evt) {
				return handler.apply(element, arguments);
			}
		}
	}
};


Element.prototype.removeEvents = function(evnt, handler){	
	var element = this;
	
	if (this.removeEventListener) { // W3C DOM
		return this.removeEventListener(evnt.replace(/^on/, ''), handler, false);
	} else if (this.detachEvent) { // IE DOM
		return this.detachEvent(/^on/.test(evnt) ? evnt : ('on' + evnt), function(){
			return handler.apply(element, arguments);
		});
	}else {
		this[evnt] = function(){};
	}	
}

DOM = new Class({
	
},{
	REGEXPRULES		:/(([\s]*[\>|\+|\~][\s]*)|[\s])|([\w\-\_\*]+)|((\:[\w\-]+([\(][^\)]+[\)])*)?(\[[\w\=\!\^\*\|\$\~]+\])?([\#|\.][\w\-\_]+)?)/g,
	REGEXPID		:/^#(.+)/,
	REGEXPCLASS		:/^\.(.+)/,
	REGEXPATTR		:/^\[([^\=\!\|\*\~\$\^]+)([\=\!\|\*\~\$\^]*)?(.*)\]/,
	REGEXPCUSTON	:/\:([A-z\-]+)(?:\(([^\)]+)?\))?/,
	REGEXPCHILD		:/^[\s]*\>[\s]*/,
	REGEXPADJACENT	:/^[\s]*\+[\s]*/,
	REGEXPSIBLINGS	:/^[\s]*\~[\s]*/,
	REGEXPALLCHILD	:/^\ /,
	REGEXPTAGNAME	:/^([\w\-\_]+|\*)$/,
	
	SUPORTNATIVESELECTOR: false,
	SUPORTNATIVEQUERYSELECTOR: false,
	
	get: function(selector, scope){
		scope = scope || document;
		
		if (selector) {
			if (such.SUPORTNATIVESELECTOR && such.SUPORTNATIVEQUERYSELECTOR && document['querySelectorAll']) 
				try {
					return scope.querySelectorAll(selector) || such.parseSelector(selector, scope);
				}catch(e){
					return such.parseSelector(selector, scope);
				}
			else 
				return such.parseSelector(selector, scope);
		}
	},
	
	parseSelector: function(selectors, scope){
		such.result = [];
		
		var selectors = selectors.split(',');
		
		for(var x = 0, selector; selector = selectors[x]; x++ ){
			var query = selector.match(such.REGEXPRULES);
				query.pop();

			such.scope = scope || document;
			
			such.parseRules(query, true);
		}
		
		such.childs = null;
		
		return such.result.length > 0 ? such.result : [];
	},
	
	parseRules: function(rules, matchall, point){
	
		var childs = such.scope['childNodes'] ? such.scope.childNodes : [];
		
		var verify = true;
		var stop = false;
		var match = true;
		
		for(var x = point || 0, rule; !stop && (rule = rules[x]); x++ ){
			//test rules
			switch(true){
				case (such.REGEXPADJACENT.test(rule)) :
					if (verify) {
						point = x + 1;
						
						do{
							such.scope = such.scope['nextSibling'];
						}
						while(such.scope && such.scope['nodeType'] != 1);
						
						if (!such.scope)
							stop = true;
						else
							match = false;
					}else
						stop = true;
				break;
				case (such.REGEXPCHILD.test(rule)) :
					point = x+1; match = such.SUPORTNATIVESELECTOR ? false : match;
					stop = true;
				break;
				case (such.REGEXPALLCHILD.test(rule)) :
					point = x+1; matchall = true;
					stop = true;
				break;
				default:
					verify = verify && such.parseRule(rule);
					stop = !verify;
				break;			
			};
			
			if(verify && rules.length <= (x+1)){
				if(Element && Element.prototype && Element.prototype['_HackSupport']){
					for(var key in Element.prototype){
						if($istype(Element.prototype[key], 'function')){
							such.scope[key] = Element.prototype[key];
						}
					}
				}
				
				such.result.push(such.scope);
			}
		}
		
		//preselect
		if (such.SUPORTNATIVESELECTOR && rule) {
			switch (true) {
				case such.REGEXPTAGNAME.test(rule) && such.scope['getElementsByTagName']:
					match = false;
					childs = such.scope.getElementsByTagName(rule) || [];
					break;
				case (param = such.REGEXPID.exec(rule)) && such.scope['getElementById']:
					match = false;
					childs = [such.scope.getElementById(param[1])];
					break;
				case (param = such.REGEXPCLASS.exec(rule)) && such.scope['getElementsByClassName']:
					match = false;
					childs = such.scope.getElementsByClassName(param[1]) || [];
					break;
			}
		}
		
		
		if(matchall)
			for(var e = 0, child; child = childs[e]; e++ ){
				if(child['nodeType'] && child['nodeType'] == 3)
					continue;
					
				such.scope = child;
				such.childs = childs;
				such.parseRules(rules, match, point);
			}
		
	},
	
	parseRule: function(rule){
		var param;

		switch(true){
			case such.REGEXPTAGNAME.test(rule):
				return (rule == '*') || such.isTag(rule, such.scope);
			break;
			case (param = such.REGEXPID.exec(rule)) && true:
				return such.isId(param[1], such.scope);
			break;
			case (param = such.REGEXPCLASS.exec(rule)) && true:
				return such.isClass(param[1], such.scope);
			break;
			case (param = such.REGEXPATTR.exec(rule)) && true:
				switch(param[2]){
					case '=':
						return such.isAttr(param[1], param[3], such.scope);
					break;
					case '!=':
						return !such.isAttr(param[1], param[3], such.scope);
					break;
					case '^=':
						return such.isAttr(param[1], new RegExp('^' + param[3]), such.scope);
					break;
					case '$=':
						return such.isAttr(param[1], new RegExp(param[3] + '$'), such.scope);
					break;
					case '*=':
						return such.isAttr(param[1], new RegExp(param[3]), such.scope);
					break;
					case '~=':
						return such.isAttr(param[1], new RegExp('(^| )' + param[3] + '( |$)'), such.scope);
					break;
					case '|=':
						return such.isAttr(param[1], new RegExp('^' + param[3] + '(\-|$)'), such.scope);
					break;
					default:
						if(param[1] && !param[2]){
							return such.isAttr(param[1], new RegExp('.+'), such.scope);
						}
						else
							return false;
				}
			break;
			case (param = such.REGEXPCUSTON.exec(rule)) && true:
				var custonselector = such.CUSTONSELECTOR[param[1]];
				
				if(custonselector)
					return custonselector(such, param[2]);
				else
					return false;
			break;			
			default:
				return false;
		}
	},
	
	addSelector: function(name, selector){
		if(such.CUSTONSELECTOR[name]) throw new Error('SELECTOR_ADDCUSTON ['+ name + ']');
		such.CUSTONSELECTOR[name] = selector;
	},
	
	removeSelector: function(name){
		if(!such.CUSTONSELECTOR[name]) throw new Error('SELECTOR_REMOVECUSTON ['+ name + ']');
		delete such.CUSTONSELECTOR[name];
	},
	
	CUSTONSELECTOR	:{
		'link': function(instance, value){
			return DOM.isTag('a', instance.scope) && DOM.isAttr('href', new RegExp('.+'), instance.scope);
		},
		'image': function(instance, value){
			return DOM.isTag('image', instance.scope);
		},
		'input': function(instance, value){
			return DOM.isTag(new RegExp('input|select|textarea|button'), instance.scope);
		},
		'file': function(instance, value){
			return DOM.isAttr('type', 'file', instance.scope);
		},
		'checkbox': function(instance, value){
			return DOM.isAttr('type', 'checkbox', instance.scope);
		},
		'checked': function(instance, value){
			return instance.scope['checked'] && instance.scope.checked;
		},
		'radio': function(instance, value){
			return DOM.isAttr('type', 'radio', instance.scope);
		},
		'password': function(instance, value){
			return DOM.isAttr('type', 'checkbox', instance.scope);
		},
		'button': function(instance, value){
			return DOM.isTag('button', instance.scope) || DOM.isAttr('type', 'button', instance.scope);
		},
		'submit': function(instance, value){
			return DOM.isAttr('type', 'submit', instance.scope);
		},
		'reset': function(instance, value){
			return DOM.isAttr('type', 'reset', instance.scope);
		},
		'select': function(instance, value){
			return DOM.isTag('select', instance.scope);
		},
		'selected': function(instance, value){
			return DOM.isAttr('selected', null, instance.scope);
		},
		'lang': function(instance, value){
			return instance.ownerDocument && instance.ownerDocument.documentElement && DOM.isAttr('lang', value, instance.ownerDocument.documentElement);
		},
		'disabled': function(instance, value){
			return DOM.isAttr('disabled', new RegExp('disabled||true'), instance.scope);
		},
		'enabled': function(instance, value){
			return !DOM.CUSTONSELECTOR.disabled(instance, value);
		},
		'empty': function(instance, value){
			return instance.scope['childNodes'] && instance.scope.childNodes.length == 0;
		},
		'parent': function(instance, value){
			return !DOM.CUSTONSELECTOR.empty(instance, value);
		},
		'header': function(instance, value){
			return DOM.isTag(new RegExp('^H[0-9]*$'), instance.scope);
		},
		'visible': function(instance, value){
			if(instance.scope.style){
				if(instance.scope.style.display.toUpperCase() == 'NONE' || DOM.isAttr('type', 'hidden', instance.scope))
					return false;
				if(instance.scope['offsetHeight'] && instance.scope['scrollWidth'] && instance.scope['offsetHeight'] == 0 && instance.scope['scrollWidth'] == 0)
					return false;
			}
			return true;
		},
		'hidden': function(instance, value){
			return !DOM.CUSTONSELECTOR.visable(instance, value);
		},
		'text': function(instance, value){
			return instance.scope['nodeType'] && instance.scope.nodeType == 3;
		},
		'contains': function(instance, value){
			var content = (instance.scope['textContent'] && instance.scope.textContent) || (instance.scope['innerText'] && instance.scope.innerText);
			return content && (new RegExp(value)).test(content);
		},
		'not': function(instance, value){
			var ignore = value ? DOM.get(value) : null;
			
			if(ignore){
				for(var x = 0, el; el = ignore[x]; x++){
					if(instance.scope === el) return false;
				}
			}
			
			return true;
		},
		'first-child': function(instance, value){
			if(!instance.scope['parentNode'] || instance.scope.nodeType == 3) return false;
			return instance.scope.parentNode['firstElementChild'] && (instance.scope.parentNode.firstElementChild === instance.scope);
		},
		'last-child': function(instance, value){
			if(!instance.scope['parentNode'] || instance.scope.nodeType == 3) return false;
			return instance.scope.parentNode['lastElementChild'] && (instance.scope.parentNode.lastElementChild === instance.scope);
		},
		'only-child': function(instance, value){
			if(instance.scope['parentNode'] && instance.scope.parentNode['childNodes']){
				for(var x=0, el; el = instance.scope.parentNode.childNodes[x];x++)
					if(el.nodeType == 1 && el !== instance.scope) return false;
			}
			
			return true;
		}
	},
	
	byTag: function(name, scope, child){
		scope = scope || document;
		
		if (child) {
			return such.byFunction(function(element){
				return such.isTag(name, element);
			}, scope, true);
		}
		else {
			return scope.getElementsByTagName(name);
		}
	},
	
	byId: function(name, scope, child){
		scope = scope || document;
		
		if (child) {
			return such.byAttr('id', name, scope, true);
		}
		else {
			return scope.getElementById(name);
		}
	},
	
	byClass: function(name, scope, child){
		return such.byFunction(function(element){
			return such.isClass(name, element);
		},scope, child);
	},
	
	byAttr: function(name, value, scope, child){
		return such.byFunction(function(element){
			return such.isAttr(name, value, element);
		},scope, child);
	},
	
	byFunction: function(compare, scope, child, result){
		result = result || [];
		scope = scope || document;
		
		if(compare(scope))
			result.push(scope);
		
		if(child == 'stop') return result;
		
		var elements = scope.childNodes;
		
		for (var x = 0, element; element = elements[x]; x++) 
			such.byFunction(compare, element, child ? 'stop' : null, result);
	
			
		return result;
	},
	
	
	isTag: function(name, element){
		return element['tagName'] && (typeof name == 'string' ? (element.tagName.toUpperCase() == name.toUpperCase()) : (name.test(element.tagName.toUpperCase())));
	},
	
	isId: function(name, element){
		return element['getAttribute'] && element.getAttribute('id') == name;
	},
	
	isClass: function(name, element){
		name = name.replace(/([^\w])/g,'\\$1');
		name = new RegExp('(^| )'+ name +'($| )');

		return element['className'] && name.test(element.className);
	},
	
	isAttr: function(name, value, element){
		value = value || '';
		return element['getAttribute'] && (typeof value == 'string' ? (element.getAttribute(name) == value) : (value.test(element.getAttribute(name)||'')));
	},
	
	toHTML: function(text){
		var convert = document.createElement('root');
			convert.innerHTML = text;
		
		return convert.childNodes;
	}
});