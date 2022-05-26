/**
 * The fv-anchor-input element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AnchorInput = Function.inherits('Hawkejs.Element.Flowview.Anchor', function AnchorInput() {
	AnchorInput.super.call(this);
});

/**
 * This element can receive drags
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Boolean}
 */
AnchorInput.setProperty('can_receive_drag', true);

/**
 * Does this input accept a signal from the given output?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {FvAnchorOutput}   output
 */
AnchorInput.setMethod(function accepts(output) {

	if (!output) {
		return false;
	}

	let parent = this.queryParents('fv-node'),
	    output_parent = output.queryParents('fv-node');

	if (parent == output_parent) {
		return false;
	}

	let input_types = this.getTypes(),
	    type;

	for (type of input_types) {
		if (type == '*') {
			return true;
		}
	}

	let output_types = output.getTypes(),
	    output_type;

	for (type of input_types) {
		for (output_type of output_types) {
			if (type == output_type) {
				return true;
			}
		}
	}

	return false;
});

/**
 * Receive something being dragged in
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorInput.setMethod(function dragEnter(pos, element) {

	let output = element.anchor_source;

	if (this.accepts(output)) {
		this.classList.add('drag-accept');
	} else {
		this.classList.add('drag-deny');
	}

});

/**
 * Receive something being dragged over
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorInput.setMethod(function dragOver(pos, element) {

	console.log('Receiving', pos, element);

});

/**
 * Receive something being dragged out
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorInput.setMethod(function dragOut(pos, element) {

	this.classList.remove('drag-accept');
	this.classList.remove('drag-deny');

	console.log('Out!')
});

/**
 * Something was dropped on this anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   pos
 * @param    {FvPath}   fv_path
 */
AnchorInput.setMethod(function dragDrop(pos, fv_path) {

	this.classList.remove('drag-accept');
	this.classList.remove('drag-deny');

	if (this.accepts(fv_path.anchor_source)) {
		fv_path.setAnchorTarget(this);
		this.paths.push(fv_path);
		this.redraw();
	}

	console.log('Dropped!')
});

/**
 * Start dragging
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   pos
 */
AnchorInput.setMethod(function dragStart(pos) {

	// Get the last connected path
	let path = this.paths.pop();

	// If there was no path, do nothing
	if (!path) {
		return false;
	}

	// Clear the anchor target (and remove the anchor_target)
	path.setAnchorTarget(false);

	return path;
});


/**
 * Redraw this anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorInput.setMethod(function redraw() {

	let rect = this.getAttachmentPoint(),
	    path,
	    i;

	for (i = 0; i < this.paths.length; i++) {
		path = this.paths[i];

		path.dx = rect.x;
		path.dy = rect.y;
		path.redraw();
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorInput.setMethod(function introduced() {

});