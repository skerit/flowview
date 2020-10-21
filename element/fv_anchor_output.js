/**
 * The fv-anchor-output element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AnchorOutput = Function.inherits('Hawkejs.Element.Flowview.Anchor', function AnchorOutput() {
	AnchorOutput.super.call(this);
});

/**
 * Make lines attach on the right
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Boolean}
 */
AnchorOutput.setProperty('attachment_side', 'right');

/**
 * Redraw this anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorOutput.setMethod(function redraw() {

	let rect = this.getAttachmentPoint(),
	    path,
	    i;

	for (i = 0; i < this.paths.length; i++) {
		path = this.paths[i];

		path.sx = rect.x;
		path.sy = rect.y;
		path.redraw();
	}
});

/**
 * Create path with this anchor as a source
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorOutput.setMethod(function createPath() {

	let path = this.createElement('fv-path');

	this.paths.push(path);

	this.grid.arrows.append(path);

	path.anchor_source = this;

	let rect = this.getAttachmentPoint();

	path.setSource(rect.x, rect.y);

	return path;

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
AnchorOutput.setMethod(function dragStart(pos) {
	return this.createPath();
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AnchorOutput.setMethod(function introduced() {

});