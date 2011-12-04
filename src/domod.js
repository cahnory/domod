/* Document Object Model Of Doom >;)
 *
 * author: François 'cahnory' Germain <cahnory@gmail.com> 
 *
 **/
(function(window) {
	var	guid  = 1,
		domod = function(items) {
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
		init = function(args) {
			var items	 = [];
			this.addItem = function(item) {
				if(!('guid' in item)) {
					item.guid = 'domod'+guid++;
				}
				items.push(item);
			}
			init.targeter.apply(this, arguments);
			return	new domod(items);
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
				this.addItem(arguments[i]);
			}
		}
	}
	
	// Add new methods
	init.fn = domod.prototype;
	
	window.domod = window.$ = init;
})(window);