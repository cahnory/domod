(function($) {
	var	dash = function(n) {
		return	n.replace(/[A-Z]/g, function($1){return '-'+$1.toLowerCase();});
	};
	
	$.fn.css = function(p, v) {
		var	op = {};
		
		if(typeof p === 'string' && typeof v === 'undefined') {
			return	this.each(function() {
				return	this.style[dash(p)];
			});
		} else if(typeof p !== 'object') {
			op[dash(p)] = v;
		} else {
			for(i in p) {
				op[dash(i)] = p[i];
			}
		}
		return	this.each(function() {
			for(var i in op) {
				if('style' in this) {
					this.style.setProperty(i, op[i]);
				}
			}
		});
	};
	if('classList' in document.body) {
		// !DOM
		$.fn.addClass = function(name) {
			return	this.each(function() {
				this.classList.add(name);
			});
		}
		$.fn.removeClass = function(name) {
			return	this.each(function() {
				this.classList.remove(name);
			});
		}
		$.fn.toggleClass = function(name, state) {
			if(typeof state === 'undefined') {
				return	this.each(function() {
					this.classList.toggle(name);
				});
			} else {
				return	state ? this.addClass(name) : this.removeClass(name);
			}
		}
		$.fn.hasClass = function(name) {
			return	this.each(function() {
				return	this.classList.contains(name);
			});
		}
	} else {
		// !Internet Explorer
		var getClassList = function(node) {
				var classes = node.className.replace(/^[\s ]*|[\s ]*$/g, '').split(/[\s ]+/g),
					list	= {};
				for(i in classes) {
					list[classes[i]] = ' '+classes[i];
				}
				return	list;
			},
			getClassString = function(list) {
				var str	= '';
				for(i in list) {
					str += list[i];
				}
				return	str.substr(1);
			}
		$.fn.addClass = function(name) {
			return	this.each(function() {
				var classList	= getClassList(this);
				classList[name]	= ' '+name;
				this.className	= getClassString(classList);
			});
		}
		$.fn.removeClass = function(name) {
			return	this.each(function() {
				var classList	= getClassList(this);
				classList[name]	= '';
				this.className	= getClassString(classList);
			});
		}
		$.fn.toggleClass = function(name, state) {
			if(typeof state === 'undefined') {
				return	this.each(function() {
					var classList	= getClassList(this);
					classList[name]	= name in classList ? '' : ' '+name;
					this.className	= getClassString(classList);
				});
			} else {
				return	state ? this.addClass(name) : this.removeClass(name);
			}
		}
		$.fn.hasClass = function(name) {
			return	this.each(function() {
				return	name in getClassList(this);
			});
		}
	}
})(domod);