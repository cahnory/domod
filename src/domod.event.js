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
				var	attachIeEventListener = function(node, event, listener) {
					var finalListener = function() {
						listener.apply(node, arguments);
					};
					node.attachEvent('on' + event, finalListener);
					return	finalListener;
				}
				return function(node, event, listener) {
					var finalListener = attachIeEventListener(node, event, listener);
					
					// Re-order events
					for(var i = eventRegister[node.guid][event].length - 1; i >= 0; i--) {
						removeEventListener(node, event, eventRegister[node.guid][event][i].finalListener);
						eventRegister[node.guid][event][i].finalListener	= attachIeEventListener(node, event, eventRegister[node.guid][event][i].listener);
					}
					return	finalListener;
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
				eventRegister[this.guid][type].push({
					type:			type,
					space:			space,
					listener:		listener,
					finalListener:	addEventListener(this, type, listener)
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
							if((!space || eventRegister[this.guid][type][j].space === space)
							&& (typeof listener === 'undefined' || listener === eventRegister[this.guid][type][j].listener)) {
								removeEventListener(this, type, eventRegister[this.guid][type][j].finalListener);
							}
						}
					}
				}
			});
		}
		return	this;
	}
})(domod);