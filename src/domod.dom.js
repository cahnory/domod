(function($) {
	var	createNode = function(tag, attributes) {
			if(typeof attributes !== 'object') { attributes = {}; }
			var	node	= document.createElement(tag);
			for(var i in attributes) { setNodeAttribute(node, i, attributes[i]); }
			return	node;
		},
		setNodeAttribute = function(node, name, value) {
			if(name === 'class') {
				node.className	= value;
			} else {
				node.setAttribute(name, value);
			}
		},
		getNodeText	= function(node) {
			var	text = '';
			if(node.nodeName === 'INPUT') {
				text = node.getAttribute('value');
			} else if(typeof node.textContent === 'string') {
				text = node.textContent;
			} else if(typeof node.text === 'string') {
				text = node.text;
			} else if(node.nodeName === 'STYLE') {
				text = node.innerHTML;
			} else if(typeof node.innerText === 'string') {
				text = node.innerText;
			} else {
				for(node = node.firstChild; node; node = node.nextSibling) {
					text += getNodeText(node);
				}
			}
			return	text;
		},
		setNodeText = (function() {
			// Internet explorer
			if(document.all) {
				return function(node, text) {
					node.innerText = text;
				}
				
			// Other browsers
			} else {
				return function(node, text) {
					node.textContent = text;
				}
			}
		})(),
		map = function(array, func) {
			for(var i in array) {
				func.apply(array[i], Array.prototype.slice.call(arguments, 2));
			}
		};

	/* !Editing */
	$.fn.append = function(tag, attributes) {
		var	node	= createNode(tag, attributes);
		return	this.each(function() {
			this.appendChild(node.cloneNode());
		});
	};
	$.fn.prepend = function(tag, attributes) {
		var	node	= createNode(tag, attributes);
		return	this.each(function() {
			this.insertBefore(node.cloneNode(), this.firstChild);
		});
	};
	$.fn.before = function(tag, attributes) {
		var	node	= createNode(tag, attributes);
		return	this.each(function() {
			this.parentNode.insertBefore(node.cloneNode(), this);
		});
	};
	$.fn.after = function(tag, attributes) {
		var	node	= createNode(tag, attributes);
		return	this.each(function() {
			this.parentNode.insertBefore(node.cloneNode(), this.nextSibling);
		});
	};
	$.fn.text = function() {
		if(arguments.length) {
			var text = arguments[0];
			return	this.each(function() {
				setNodeText(this, text);
			});
		} else {
			var text = '';
			this.each(function() {
				text += getNodeText(this);
			});
			return	text;
		}
	};
	
	/* !Sibling */
	$.fn.eq = function(n) {
		return	$(this.item(n));
	};
	$.fn.gt = function(n) {
		return	$.apply(this, this.items().slice(n+1));
	};
	$.fn.gte = function(n) {
		return	$.apply(this, this.items().slice(n));
	};
	$.fn.lt = function(n) {
		return	$.apply(this, this.items().slice(0, n));
	};
	$.fn.lte = function(n) {
		return	$.apply(this, this.items().slice(0, n+1));
	};
	$.fn.first = function() {
		return	$(this.item(0));
	};
	$.fn.last = function() {
		return	$(this.item(this.items().length - 1));
	};
	$.fn.next = function() {
		var nodes	= [];
		this.each(function() {
			var	next = this;
			while(next = next.nextSibling) {
				if(next.nodeType%8 === 1) {
					nodes.push(next);
					break;
				}
			}
		});
		return	$.apply(this, nodes);
	};
	$.fn.previous = function() {
		var nodes	= [];
		this.each(function() {
			var	prev = this;
			while(prev = prev.previousSibling) {
				if(prev.nodeType%8 === 1) {
					nodes.push(prev);
					break;
				}
			}
		});
		return	$.apply(this, nodes);
	};
	$.fn.parent = function() {
		var nodes	= [];
		this.each(function() {
			nodes.push(this.parentNode);
		});
		return	$.apply(this, nodes);
	};
	$.fn.parents = function() {
		var nodes	= [];
		this.each(function() {
			var parents	= [],
				parent	= this;
			while(parent = parent.parentNode) {
				parents.push(parent);
			}
			nodes	= nodes.concat(parents);
		});
		return	$.apply(this, nodes);
	};
	$.fn.children = function() {
		var nodes	= [];
		this.each(function() {
			for(var i = 0 in this.childNodes) {
				nodes.push(this.childNodes[i]);
			}
		});
		return	$.apply(this, nodes);
	};
})(domod);