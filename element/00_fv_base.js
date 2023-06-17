/**
 * The base class for all other flowview elements
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Base = Function.inherits('Hawkejs.Element', 'Hawkejs.Element.Flowview', function Base() {
	Base.super.call(this);
});

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStatic('custom_element_prefix', 'fv');

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStatic('is_abstract_class', true, false);

/**
 * The base grid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Base.setProperty(function grid() {
	return this.findClosestGrid();
});

/**
 * The left position
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setProperty(function left() {
	return this.getRectInGrid().left;
});

/**
 * The top position
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setProperty(function top() {
	return this.getRectInGrid().top;
});

/**
 * The default draggingTo behaviour is to move it
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   pos
 */
Base.setMethod(function draggingTo(pos) {

	let dx = pos.start_pos.corner_x + pos.change_x,
	    dy = pos.start_pos.corner_y + pos.change_y;

	return this.moveTo(dx, dy);
});

/**
 * Get the boundingbox relative to the grid
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.2
 */
Base.setMethod(function getRectInGrid() {

	const grid = this.grid;

	if (!grid) {
		return;
	}

	let grid_rect = this.grid.getRect(),
	    rect = this.getBoundingClientRect();

	let result = {
		x      : rect.x - grid_rect.x,
		y      : rect.y - grid_rect.y,
		top    : rect.top - grid_rect.top,
		left   : rect.left - grid_rect.left,
		height : rect.height,
		width  : rect.width,
	};

	return result;
});

/**
 * Get the given's element position in the document
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Base.setMethod(function getElementPosInDocument(element) {

	let curleft = 0,
	    curtop = 0;
	
	if (element.offsetParent) {
		do {
			curleft += element.offsetLeft;
			curtop += element.offsetTop;
		} while (element = element.offsetParent);
	}

	return {
		x: curleft,
		y: curtop
	};
});

/**
 * Move the element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setMethod(function moveTo(x, y) {

	if (typeof x == 'object') {
		let obj = x;
		x = obj.x;
		y = obj.y;
	}

	this.style.left = x + 'px';
	this.style.top = y + 'px';

	if (this.redraw) {
		let that = this;

		if (this.raf_id) {
			cancelAnimationFrame(this.raf_id);
		}

		this.raf_id = requestAnimationFrame(function doRedraw() {
			that.raf_id = null;
			that.redraw();
		});
	}
});

/**
 * Create an SVG element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setMethod(function createSvgElement(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
});

/**
 * Look for the closest element of its type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Base.setMethod(function findClosestGrid() {
	return this.queryClosest('fv-grid');
});

/**
 * Look for the closest element of its type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Base.setMethod(function queryClosest(query) {

	let parent = this.parentElement,
	    result;
	
	while (!result && parent) {
		result = parent.querySelector(query);
		parent = parent.parentElement;
	}

	return result;
});