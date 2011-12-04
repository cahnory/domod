(function($) {
	$.targeter = function(selector) {
		if(typeof selector === 'string') {
			var items = Sizzle(selector);
			for(i in items) {
				this.addItem(items[i]);
			}
		} else {
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
	
	$.fn.closest = function(selector) {
		var nodes	= [];
		this.each(function() {
			var parent	= this;
			while(parent = parent.parentNode) {
				if(Sizzle.filter(selector, [parent]).length) {
					nodes.push(parent);
					break;
				}
			}
		});
		return	$.apply(this, nodes);
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