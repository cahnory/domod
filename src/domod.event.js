(function($) {
	var eventRegister	= {};
	var	addEventListener	= (function() {
			if('addEventListener' in document) {
				return function(node, event, listener) {
					node.addEventListener(event, listener);
					return	listener;
				}
				
			// Internet Explorer
			} else {
				return function(node, event, listener) {
					var fpNotify = function() {
						listener.apply(node, arguments);
					}
					node.attachEvent('on' + event, fpNotify);
					return	fpNotify;
				}
			}
		})(),
		removeEventListener	= (function() {
			if('removeEventListener' in document) {
				return function(node, event, listener) {
					node.removeEventListener(event, listener);
				}
				
			// Internet Explorer
			} else {
				return function(node, event, listener) {
					node.detachEvent('on' + event, listener);
				}
			}
		})();

	$.fn.on = function(event, listener) {
		// Split event types by spaces
		var events	= event.split(/[\s ]/g);
		for(var i in events) {
			var	type	= events[i].replace(/^([^.]+).*/, '$1'),
				space	= events[i].replace(/^([^.]+)/, '');
			this.each(function() {
				if(!(this.guid in eventRegister)) {
					eventRegister[this.guid] = {};
				}
				if(!(type in eventRegister[this.guid])) {
					eventRegister[this.guid][type]	= [];
				}
				console.log(type, space);
				eventRegister[this.guid][type].push({
					type:			type,
					space:			space,
					listener:		addEventListener(this, type, listener)
				});
			});
		}
		return	this;
	};
	$.fn.off = function(event, listener) {
		// Split event types by spaces
		var events	= event.split(/[\s ]/g);
		for(var i in events) {
			var	type	= events[i].replace(/^([^.]+).*/, '$1'),
				space	= events[i].replace(/^([^.]+)/, '');
			this.each(function() {
				if(this.guid in eventRegister) {
					if(type in eventRegister[this.guid]) {
						for(j in eventRegister[this.guid][type]) {
								console.log(type, space);
							if(!space || eventRegister[this.guid][type][j].space === space) {
								removeEventListener(this, type, eventRegister[this.guid][type][j].listener);
							}
						}
					}
				}
			});
		}
		return	this;
	}
})(domod);