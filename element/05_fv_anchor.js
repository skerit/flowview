/**
 * The fv-anchor element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Anchor = Function.inherits('Hawkejs.Element.Flowview.Base', function Anchor() {
	Anchor.super.call(this);
	this.paths = [];
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
Anchor.setProperty('is_draggable', true);

/**
 * Make this node draggable by default
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {String}
 */
Anchor.setAttribute('name');

/**
 * The node that owns this anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Object}
 */
Anchor.setAssignedProperty('owner_node');

/**
 * Set the config data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Object}
 */
Anchor.setAssignedProperty('config');

/**
 * Get the value: all the connections
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
Anchor.setProperty(function value() {

	let connections = [],
	    entry,
	    path;

	for (path of this.paths) {

		if (!path.anchor_target) {
			continue;
		}

		entry = {
			source: {
				node_uid    : path.anchor_source.owner_node.uid,
				anchor_name : path.anchor_source.name,
			},
			target: {
				node_uid    : path.anchor_target.owner_node.uid,
				anchor_name : path.anchor_target.name,
			}
		};

		connections.push(entry);
	}

	return {
		connections
	};
});

/**
 * Get the existing link to the given anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 *
 * @param    {FvAnchor}   anchor
 */
Anchor.setMethod(function getExistingPathTo(anchor) {

	if (!anchor) {
		return null;
	}

	let path;

	for (path of this.paths) {

		if (!path) {
			continue;
		}

		if (path.isConnectedTo(this, anchor)) {
			return path;
		}
	}
});

/**
 * Connect this anchor to the given one
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {FvAnchor}   anchor
 */
Anchor.setMethod(function connectTo(anchor) {

	if (!anchor) {
		return false;
	}

	// Don't allow connections within the same node
	if (anchor.owner_node == this.owner_node) {
		return false;
	}

	// The anchors have to be of different type
	if (anchor.constructor == this.constructor) {
		return false;
	}

	let fv_path = this.getExistingPathTo(anchor);

	// If this is already connected to the anchor, return the existing path
	if (fv_path) {
		return fv_path;
	}

	let output,
	    input;

	if (anchor.nodeName == 'FV-ANCHOR-INPUT') {
		input = anchor;
		output = this;
	} else {
		input = this;
		output = anchor;
	}

	fv_path = output.createPath();

	fv_path.setAnchorTarget(input);
	input.paths.push(fv_path);
	input.redraw();

	return fv_path;
});

/**
 * Get the types
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
Anchor.setMethod(function getTypes() {

	let config = this.config,
	    result = [];

	if (config && config.type) {
		if (Array.isArray(config.type)) {
			let i;

			for (i = 0; i < config.type.length; i++) {
				result.push(config.type[i]);
			}
		} else {
			result.push(config.type);
		}
	}

	return result;
});

/**
 * Get the attachment point
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.2
 *
 * @return   {Object}
 */
Anchor.setMethod(function getAttachmentPoint() {

	let rect = this.getRectInGrid();

	if (!rect) {
		return null;
	}

	let result = {
		x   : rect.x,
		y   : rect.y + (rect.height / 2),
	};

	if (this.attachment_side === 'right') {
		result.x += rect.width;
	}

	return result;
});

/**
 * Remove the given path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Anchor.setMethod(function removePath(path) {

	if (!path) {
		return;
	}

	this.paths.clean(path);
});

/**
 * Detach the paths
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Anchor.setMethod(function detachPaths() {
	while (this.paths.length) {
		let path = this.paths.shift();
		path.destroy();
	}
});

/**
 * Destroy this anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Anchor.setMethod(function destroy() {
	this.detachPaths();
	this.remove();
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Anchor.setMethod(function introduced() {

});