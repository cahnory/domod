/* Document Object Model Of Doom >;)
 *
 * author: François 'cahnory' Germain <cahnory@gmail.com> 
 *
 **/
(function(window) {
	var domod = function(items) {
			this.length	= items.length;
			this.each	= function(func) {
				var	res;
				for(var i = 0; i < items.length; i++) {
					if(typeof (res = func.apply(items[i], [i])) !== 'undefined') {
						return	res;
					}
				}
				return	this;
			};
			this.item	= function(n) {
				return	items[n];
			};
			this.items	= function() {
				return	items;
			}
			return	this;
		},
		init = function() {
			return	new domod(init.targeter.apply(window, arguments));
		};
	
	// Returns an array of dom element
	init.targeter = function() {
		var	items	= [];
		for(var i = 0; i < arguments.length; i++) {
			// Keep element and document nodes (1 & 9)
			if(arguments[i] !== null && arguments[i] !== undefined && arguments[i].nodeType%8 === 1) {
				for(var j = i+1; j < arguments.length; j++) {
					if (arguments[i] === arguments[j]) {
						j	= ++i;
					}
				}
				items.push(arguments[i]);
			}
		}
		return	items;
	}
	
	// Add new methods
	init.fn = domod.prototype;
	
	window.domod = window.$ = init;
})(window);