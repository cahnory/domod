(function($) {
	$.targeter = function(selector) {
		if(typeof selector === 'string') {
			return	Sizzle(selector);
		} else {
			var	items	= [];
			for(var i = 0; i < arguments.length; i++) {
				// Keep element and document nodes (1 & 9)
				if(arguments[i] !== null && arguments[i] !== undefined && arguments[i].nodeType%8 === 1) {
					items.push(arguments[i]);
				}
			}
			return	items;
		}
	}
	
	// Return descents elements that match the selector
	$.fn.find = function(selector) {
		var items	= [];
		this.each(function() {
			Sizzle(selector, this, items);
		});
		return	$.apply(this, items);
	};
	
	// Return children elements that match the selector
	$.fn.children = function(selector) {
		var items = [];
		if(selector) {
			this.each(function() {
				items = items.concat(Sizzle.filter(selector, this.childNodes));
			});
		} else {
			this.each(function() {
				for(var i = 0 in this.childNodes) {
					items.push(this.childNodes[i]);
				}
			});
		}
		return	$.apply(this, items);
	};
	
	// Remove elements that match the selector
	$.fn.not = function(selector) {
		return	$.apply(this, Sizzle.filter(selector, this.items(), false, true));
	};
	
	// Remove elements that don't match the selector
	$.fn.is = function(selector) {
		return	$.apply(this, Sizzle.filter(selector, this.items()));
	}
})(domod)