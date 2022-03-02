/**
 * The fv-grid element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Grid = Function.inherits('Hawkejs.Element.Flowview.Base', function Grid() {
	Grid.super.call(this);

	this.innerHTML = `
<div class="fv-grid-inner">
	<div class="nodes"></div>
	<div class="arrows"></div>
</div>
`;
});

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setStylesheetFile('flowview');

/**
 * Inner wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.addElementGetter('inner_grid', 'div.fv-grid-inner');

/**
 * Node wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.addElementGetter('nodes', 'div.nodes');

/**
 * Arrow paths svg
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.addElementGetter('arrows', 'div.arrows');

/**
 * The record id
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Grid.setAttribute('grid-id');

/**
 * Listen for scale changes
 * @TODO: Make scaling work
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setAttribute('scale', function getScale(scale) {

	scale = parseFloat(scale);

	if (!isFinite(scale)) {
		scale = 1;
	}

	return scale;

}, function setScale(scale) {

	scale = parseFloat(scale);

	if (!isFinite(scale)) {
		scale = 1;
	}

	this.nodes.style.setProperty('transform', 'scale(' + scale + ')');
	this.arrows.style.setProperty('transform', 'scale(' + scale + ')');

	return scale;
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setProperty(function value() {

	let result = [],
	    node,
	    temp,
	    i;

	for (i = 0; i < this.nodes.children.length; i++) {
		node = this.nodes.children[i];
		temp = node.value;

		if (temp) {
			result.push(temp);
		}
	}

	return result;

}, function setValue(value) {

	this.clear();

	if (!value) {
		return;
	}

	let node_config,
	    i;

	for (i = 0; i < value.length; i++) {
		node_config = value[i];

		this.addNode(node_config);
	}

});

/**
 * Get a node by its uid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   uid
 */
Grid.setMethod(function getNodeByUid(uid) {

	if (!uid) {
		return;
	}

	let result = this.querySelector('fv-node[uid="' + uid + '"]');

	return result;
});

/**
 * Clear the grid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setMethod(function clear() {
	Hawkejs.removeChildren(this.nodes);
	Hawkejs.removeChildren(this.arrows);
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setMethod(function introduced() {
	this.initDragEvents();
	this.initRectListener();
});

/**
 * Apply rect events
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setMethod(function initRectListener() {

	const that = this;

	window.addEventListener('resize', refreshRect);

	function refreshRect() {
		that.rect = that.getBoundingClientRect();
	}

	refreshRect();
});

/**
 * Get the cached rect
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setMethod(function getRect() {

	if (!this.rect) {
		this.rect = this.getBoundingClientRect();
	}

	return this.rect;
});

/**
 * Add a node to the grid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Grid.setMethod(function addNode(config) {

	let node = this.createElement('fv-node');

	this.nodes.append(node);

	// Get the list entry in order to get the node configuration
	let list_entry = this.queryClosest('fv-list-entry[type="' + config.type + '"]'),
	    component_config;

	if (list_entry) {
		component_config = list_entry.config;
	}

	if (component_config) {
		if (!config.inputs || !config.inputs.length) {
			config.inputs = component_config.inputs;
		}

		if (!config.outputs || !config.outputs.length) {
			config.outputs = component_config.outputs;
		}

		if (!config.buttons) {
			config.buttons = component_config.buttons;
		}

		if (!config.schema) {
			config.schema = component_config.schema;
		}
	}

	node.value = config;

	if (component_config && component_config.title) {
		node.title_element.textContent = component_config.title;
	}
});

/**
 * Apply drag events
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.setMethod(function initDragEvents() {

	const that = this;

	this.addEventListener('touchstart', dragStart);
	this.addEventListener('mousedown', dragStart);
	this.addEventListener('touchend', dragEnd);
	this.addEventListener('mouseup', dragEnd);
	this.addEventListener('touchmove', dragging);
	this.addEventListener('mousemove', dragging);

	let start_pos; // Starting position

	let inside_x,
	    inside_y;

	let grid_rect;

	let initial_x,
	    initial_y,
	    current_x,
	    current_y,
	    active;

	let x_offset = 0,
	    y_offset = 0;

	/**
	 * Get cursor coordinates
	 */
	function getCursorPosition(e, element) {

		let scale = that.scale,
		    x,
		    y;

		if (scale == null) {
			scale = 1;
		}

		if (!grid_rect) {
			grid_rect = that.getRect();
		}

		// Calculate the position of the mouseclick inside the target
		if (e.type === 'touchstart' || e.type == 'touchmove') {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			x = e.clientX;
			y = e.clientY;
		}

		x /= scale;
		y /= scale;

		let result = {
			// Absolute coordinates on the page
			x         : x,
			y         : y,

			// Coordinates on the grid
			grid_x    : x - grid_rect.x,
			grid_y    : y - grid_rect.y,

			// Change since the start
			change_x  : null,
			change_y  : null,

			// Coordinates inside the current element
			inside_x  : null,
			insidy_y  : null,

			// Coordinates of the active element's topleft corner
			corner_x  : null,
			corner_y  : null,

			// The starting position
			start_pos : null,

			// The target element
			target    : e.target,
		};

		if (start_pos) {
			result.change_x = result.x - start_pos.x;
			result.change_y = result.y - start_pos.y;
			result.start_pos = start_pos;
		}

		if (element) {
			let rect = element.getBoundingClientRect();

			result.corner_x = rect.x - grid_rect.x;
			result.corner_y = rect.y - grid_rect.y;

			result.inside_x = result.x - rect.x;
			result.inside_y = result.y - rect.y;
		}

		return result;
	}

	/**
	 * Called upon drag start
	 */
	function dragStart(e) {

		// Update the grid's rectangle just in case
		grid_rect = that.getRect();

		let pos = getCursorPosition(e);

		active = getDraggable(e, pos);

		if (!active) {
			return;
		}

		// Recalculate the position with extra element info
		pos = getCursorPosition(e, active);

		// Remember this as the start position
		start_pos = pos;

		let rect = active.getBoundingClientRect();

		x_offset = rect.left;
		y_offset = rect.top;

		// Calculate the position of the mouseclick inside the target
		inside_x = pos.x - x_offset;
		inside_y = pos.y - y_offset;
	}

	/**
	 * Called when dragging ends
	 */
	function dragEnd(e) {

		if (active && active.dragEnd) {
			e.preventDefault();
			let pos = getCursorPosition(e, active);
			active.dragEnd(pos);
		}

		active = false;
		start_pos = null;
	}

	/**
	 * Called when actively dragging
	 */
	function dragging(e) {

		if (!active) {
			return;
		}

		e.preventDefault();

		let pos = getCursorPosition(e, active);

		active.draggingTo(pos);
	}

	/**
	 * Get the draggable element
	 */
	function getDraggable(event, pos) {

		let target = _checkTarget(event.target, event, pos);

		if (target) {
			return target;
		}

		if (event.target == that.nodes) {

			return _getPathByCircle(event, pos);
		}
	}

	function _checkTarget(target, event, pos) {

		while (target) {
			if (target.is_draggable) {

				if (target.dragStart) {
					// Create new position object with
					// the current element
					pos = getCursorPosition(event, target);

					return target.dragStart(pos);
				}

				return target;
			}

			if (that == target) {
				break;
			}

			if (!that.contains(target)) {
				break;
			}

			target = target.parentElement;
		}
	}

	function _getPathByCircle(event, pos) {

		let path_element,
		    rect,
		    i;

		for (i = 0; i < that.arrows.children.length; i++) {
			path_element = that.arrows.children[i];

			if (!path_element.svg_circle) {
				continue;
			}

			rect = path_element.svg_circle.getBoundingClientRect();

			if (!rect.width) {
				continue;
			}

			if (pos.x < rect.x) {
				continue;
			}

			if (pos.y < rect.y) {
				continue;
			}

			if (pos.x > rect.right) {
				continue;
			}

			if (pos.y > rect.bottom) {
				continue;
			}

			return path_element;
		}
	}

	// Listen to the "dragover" event.
	// This is the actual Drag-And-Drop API, something totally different
	// from our "dragging nodes" functions
	this.addEventListener('dragenter', function onDragEnter(e) {
		if (e.dataTransfer.types.includes('application/flowview_component')) {
			e.preventDefault();
		}
	}, false);

	this.addEventListener('dragover', function onDragOver(e) {
		if (e.dataTransfer.types.includes('application/flowview_component')) {
			e.preventDefault();
		}
	}, false);

	this.addEventListener('drop', function onDrop(e) {

		let component = e.dataTransfer.getData('application/flowview_component');

		if (component) {
			// Add
			let pos = getCursorPosition(e);

			that.addNode({
				type : component,
				pos  : pos
			});
		}

	}, false);

});