(function($) {
	var eventRegister	= {},
		// Wrap listener to normalise its calling
		getEventListener	= function(node, listener, data) {
			var finalListener = function(e) {
				// normalise event object
				if(!(e.preventDefault)) {
					e.preventDefault = function() {
						e.returnValue = false;
					}
				}
				if(!(e.stopPropagation)) {
					e.stopPropagation = function() {
						e.cancelBubble = true;
					}
				}
				// Make this to reference node in IE
				listener.apply(node, [e, data]);
			};
			return	finalListener;
		}
		addEventListener	= (function() {
			if('addEventListener' in document) {
				return function(node, event, listener, data) {
					var finalListener = getEventListener(node, listener, data);
					node.addEventListener(event, finalListener);
					return	finalListener;
				}
				
			// Internet Explorer
			} else {
				var	attachIeEventListener = function(node, event, listener, data) {
					var finalListener = getEventListener(node, listener, data);
					node.attachEvent('on' + event, finalListener);
					return	finalListener;
				}
				return function(node, event, listener, data) {
					var finalListener = attachIeEventListener(node, event, listener, data);
					
					// Re-order events
					for(var i = eventRegister[node.guid][event].length - 1; i >= 0; i--) {
						removeEventListener(node, event, eventRegister[node.guid][event][i].finalListener);
						eventRegister[node.guid][event][i].finalListener	= attachIeEventListener(node, event, eventRegister[node.guid][event][i].listener, eventRegister[node.guid][event][i].data);
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
		})(),
		triggerEvent = (function() {
			if('createEvent' in document) {
				return	function(node, type) {
					if(type === 'click' || type.match(/^mouse/)) {
						event = document.createEvent('MouseEvents');
						event.initMouseEvent(type, true, true, window);
					} else {
						event = document.createEvent('HTMLEvents');
						event.initEvent(type, true, true);
					}
					node.dispatchEvent(event)
				}
			} else {
				return	function(node, type) {
					node.fireEvent('on'+type);
				}
			}
		})();

	$.fn.on = function(event, listener, data) {
		// Split event types by spaces
		var events	= event.split(/[\s ]/g),
			data	= typeof data === 'object' ? data : {};
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
					data:			data,
					finalListener:	addEventListener(this, type, listener, data)
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
	};
	$.fn.trigger = function(event) {
		// Split event types by spaces
		var events	= event.split(/[\s ]/g);
		for(var i in events) {
			var	type	= events[i].replace(/^([^.]+).*/, '$1');
			this.each(function() {
				triggerEvent(this, event);
			});
		}
		return	this;
	};
})(domod);