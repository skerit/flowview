/**
 * The fv-path element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Path = Function.inherits('Hawkejs.Element.Flowview.Base', 'Path');

/**
 * Make this node draggable by default
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Boolean}
 */
Path.setProperty('is_draggable', true);

/**
 * The source (output) anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {FvAnchor}
 */
Path.setProperty('anchor_source', null);

/**
 * The target (input) anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {FvAnchor}
 */
Path.setProperty('anchor_target', null);

/**
 * The current element we're dragging over
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {FvAnchor}
 */
Path.setProperty('over_element', null);

/**
 * Show the circle?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Path.setMethod(function showCircle(show) {

	if (!this.svg_circle) {
		this.svg_circle = this.createSvgElement('circle');
		this.svg_circle.classList.add('handle');
		this.svg_circle.setAttribute('r', this.grid.applyScale(5));
		this.svg.append(this.svg_circle);
	}

	if (show || show == null) {
		this.svg_circle.removeAttribute('hidden');
	} else {
		this.svg_circle.setAttribute('hidden', 'hidden');
	}

});

/**
 * Set the attachment point start
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Path.setMethod(function setSource(x, y) {

	if (!this.path_group) {
		this.svg = this.createSvgElement('svg');
		this.path_group = this.createSvgElement('g');
		this.svg_path = this.createSvgElement('path');
		this.path_group.append(this.svg_path);

		this.svg.append(this.path_group);

		this.showCircle();

		this.append(this.svg);
	}

	this.sx = x;
	this.sy = y;

	this.redraw();
});

/**
 * Set the target anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Path.setMethod(function setAnchorTarget(input) {
	this.anchor_target = input;

	this.showCircle(!input);
});

/**
 * Is this path connected to the given anchors?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 *
 * @param    {FvAnchor}   anchor_one
 * @param    {FvAnchor}   anchor_two
 */
Path.setMethod(function isConnectedTo(anchor_one, anchor_two) {

	if (!anchor_one && !anchor_two) {
		return false;
	}

	let connected_to_anchor_one = this.anchor_source == anchor_one || this.anchor_target == anchor_one;

	if (arguments.length == 1) {
		return connected_to_anchor_one;
	}

	let connected_to_anchor_two = this.anchor_source == anchor_two || this.anchor_target == anchor_two;

	return connected_to_anchor_one && connected_to_anchor_two;
});

/**
 * Set the arrow target
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Path.setMethod(function draggingTo(pos) {

	this.dx = pos.grid_x;
	this.dy = pos.grid_y;

	this.svg_circle.setAttribute('cx', this.dx);
	this.svg_circle.setAttribute('cy', this.dy);

	// Dragged out of element
	if (this.over_element && pos.target != this.over_element) {
		this.over_element.dragOut(pos, this);
		this.over_element = null;
	}

	if (pos.target && pos.target.can_receive_drag) {
		if (!this.over_element) {
			this.over_element = pos.target;
			this.over_element.dragEnter(pos, this);
		} else {
			this.over_element.dragOver(pos, this);
		}
	}

	// @TODO: dragEnd/dropped


	this.redraw();
});

/**
 * The drag ended
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Path.setMethod(function dragEnd(pos) {
	if (this.over_element) {
		this.over_element.dragDrop(pos, this);
		this.over_element = null;
	} else {
		this.destroy();
	}
});

/**
 * Allow dragging when starting at the circle
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   pos
 */
Path.setMethod(function dragStart(pos) {

	console.log('Dragging path:', pos);

	return this;

});

/**
 * Redraw the path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Path.setMethod(function redraw() {

	if (this.dx == null) {
		return;
	}

	this.style.strokeWidth = this.grid.applyScale(4);

	if (this.svg_circle) {
		this.svg_circle.setAttribute('r', this.grid.applyScale(5));
	}

	let sx = this.sx,
	    sy = this.sy,
		dx = this.dx,
		dy = this.dy;
	
	let path = 'M' + sx + ',' + sy + ' ' + dx + ',' + dy;
	this.svg_path.setAttribute('d', path);
});

/**
 * Delete this path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Path.setMethod(function destroy() {

	if (this.anchor_source) {
		this.anchor_source.removePath(this);
	}

	if (this.anchor_target) {
		this.anchor_target.removePath(this);
	}

	this.svg_path.remove();
	this.remove();
});