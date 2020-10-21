/**
 * The fv-path element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Path = Function.inherits('Hawkejs.Element.Flowview.Base', function Path() {
	Path.super.call(this);
});

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
		this.svg_circle.setAttribute('r', 5);
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

	let path = 'M' + this.sx + ',' + this.sy + ' ' + this.dx + ',' + this.dy;
	this.svg_path.setAttribute('d', path);
});