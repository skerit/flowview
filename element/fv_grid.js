/**
 * The fv-grid element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
const Grid = Function.inherits('Hawkejs.Element.Flowview.Base', 'Grid');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setTemplate(`
<div class="fv-grid-inner">
	<div class="nodes"></div>
	<div class="arrows"></div>
</div>
`, true);

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
 * All fv-node elements
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Grid.addElementsGetter('all_fv_nodes', 'div.nodes fv-node');

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
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.1
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

	this.queueRedraw();

	return scale;
});

/**
 * Listen for translate changes
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setAttribute('translate-x', function getTranslateX(x) {

	x = parseFloat(x);

	if (!isFinite(x)) {
		x = 0;
	}

	return x;

}, function setTranslateX(x) {

	x = parseFloat(x);

	if (!isFinite(x)) {
		x = 0;
	}

	this.queueRedraw();

	return x;
});

/**
 * Listen for translate changes
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setAttribute('translate-y', function getTranslateY(y) {

	y = parseFloat(y);

	if (!isFinite(y)) {
		y = 0;
	}

	return y;

}, function setTranslateY(y) {

	y = parseFloat(y);

	if (!isFinite(y)) {
		y = 0;
	}

	this.queueRedraw();

	return y;
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
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

	if (Blast.isNode) {
		this.assigned_data.value = value;
		return;
	}

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
 * Queue a redraw
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function queueRedraw() {

	if (this._redraw_id) {
		cancelAnimationFrame(this._redraw_id);
	}

	this._redraw_id = requestAnimationFrame(() => {
		this.redraw();
	})
});

/**
 * Redraw everything
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function redraw() {

	let scale = this.scale,
	    pan_x = this.translate_x || 0,
		pan_y = this.translate_y || 0;
	
	let transform = '';

	if (scale) {
		transform += 'scale(' + scale + ')';
	}

	if (pan_x || pan_y) {
		if (transform) {
			transform += ' ';
		}

		transform += 'translate(' + pan_x + 'px, ' + pan_y + 'px)';
	}

	this.nodes.style.setProperty('transform', transform);

	let fv_nodes = this.all_fv_nodes;

	if (fv_nodes && fv_nodes.length) {
		for (let i = 0; i < fv_nodes.length; i++) {
			fv_nodes[i].redraw();
		}
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
 * @version  0.1.2
 */
Grid.setMethod(function introduced() {

	if (this.assigned_data.value) {
		this.value = this.assigned_data.value;
	}

	this.initDragEvents();
	this.initRectListener();
	this.queueRedraw();

	setTimeout(() => {
		this.queueRedraw();
	}, 100);
});

/**
 * Apply rect events
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Grid.setMethod(function initRectListener() {

	const that = this;

	window.addEventListener('resize', refreshRect);
	window.addEventListener('scroll', refreshRect);

	function refreshRect() {
		that.rect = null;
	}

	refreshRect();
});

/**
 * Get the cached rect of this grid
 * (The scale has no effect on this)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Grid.setMethod(function getRect() {

	if (!this.rect) {
		this.rect = this.getBoundingClientRect();

		let pos_in_doc = this.getElementPosInDocument(this);

		this.rect.page_x = pos_in_doc.x;
		this.rect.page_y = pos_in_doc.y;
	}

	return this.rect;
});

/**
 * Apply the scale
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function applyScale(value) {
	return value * this.scale;
});

/**
 * Get the scaled X value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function scaleX(x) {
	return x * this.scale;
});

/**
 * Get the scaled Y value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function scaleY(y) {
	return y * this.scale;
});

/**
 * Get the translated X value
 * (This scale version is not used yet)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function translateX(x) {

	if (this.scale == 1) {
		return x;
	}

	// Get the measure of this element
	let rect = this.getRect();

	// Calculate how big it virtually is with the scaling
	let width = rect.width / this.scale;

	// See how much wider it has gotten
	let extra_width = 0 - ((width - rect.width) / 2);

	let result = extra_width + x;

	return result;
});

/**
 * Get the translated Y value
 * (This scale version is not used yet)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Grid.setMethod(function translateY(y) {

	if (this.scale == 1) {
		return y;
	}

	// Get the measure of this element
	let rect = this.getRect();

	// Calculate how big it virtually is with the scaling
	let height = rect.height / this.scale;

	// See how much wider it has gotten
	let extra_height = 0 - ((height - rect.height) / 2);

	let result = extra_height + y;

	return result;
});

/**
 * Get a fv-list-entry by type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Grid.setMethod(function getListEntry(type) {
	let list_entry = this.queryClosest('fv-list-entry[type="' + type + '"]');
	return list_entry;
});

/**
 * Move the grid contents
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Grid.setMethod(function moveTo(x, y) {
	this.translate_x = x;
	this.translate_y = y;
});

/**
 * Add a node to the grid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Grid.setMethod(async function addNode(config) {

	let list = this.queryClosest('fv-list');

	if (list && list.loading) {
		await list.loading;
	} else if (Blast.isBrowser && list) {
		list.loadRemote();
		await list.loading;
	}

	let node = this.createElement('fv-node');

	this.nodes.append(node);

	// Get the list entry in order to get the node configuration
	let list_entry = this.getListEntry(config.type),
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

		if (!config.class) {
			config.class = component_config.class;
		}
	}

	node.value = config;

	if (component_config && component_config.title) {
		node.title_element.textContent = component_config.title;
	}

	if (node.unscaled_top == null) {
		node.moveTo(0 - this.translate_x, 0 - this.translate_y);
	}
});

/**
 * Apply drag events
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.2
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
	
	let panning = false;

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
		// (2022-03-02: In this code it should actually use the position in
		// the current *document*, so pageX/Y should be used. Should probably
		// change this later)
		if (e.type === 'touchstart' || e.type == 'touchmove') {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		} else {
			x = e.pageX;
			y = e.pageY;
		}

		let result = {
			// Absolute coordinates on the page
			x         : x,
			y         : y,

			// Coordinates on the grid
			grid_x    : x - grid_rect.page_x,
			grid_y    : y - grid_rect.page_y,

			// Change since the start
			change_x  : null,
			change_y  : null,

			// Coordinates inside the current element
			inside_x  : null,
			inside_y  : null,

			// Coordinates of the active element's topleft corner
			corner_x  : null,
			corner_y  : null,

			// The starting position
			start_pos : null,

			// The target element
			target    : e.target,
		};

		if (start_pos) {
			result.change_x = (result.x - start_pos.x) / scale;
			result.change_y = (result.y - start_pos.y) / scale;
			result.start_pos = start_pos;
		}

		if (element) {
			let rect = element.getBoundingClientRect();

			let left = element.unscaled_left,
			    top = element.unscaled_top;
			
			if (panning && element == that) {
				left = that.translate_x;
				top = that.translate_y;
			}
			
			if (left != null) {
				result.corner_x = left;
			} else {
				result.corner_x = rect.x - grid_rect.x;
			}

			if (top != null) {
				result.corner_y = top;
			} else {
				result.corner_y = rect.y - grid_rect.y;
			}

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

		if (e.ctrlKey) {
			panning = true;
			active = this;
		} else {
			active = getDraggable(e, pos);
		}

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

		panning = false;
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

					return target.dragStart(pos, event);
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

	// Zoom in/out when using scroll wheel + control
	this.addEventListener('wheel', e => {

		if (!e.ctrlKey) {
			return;
		}

		let direction = 1;

		if (e.deltaY > 0) {
			direction = -1;
		}

		e.preventDefault();

		let scale = this.scale;

		if (scale > 0) {
			scale += (0.05 * direction);
		}

		if (scale < 0.1) {
			scale = 0.1;
		}

		this.scale = scale;
	});

});