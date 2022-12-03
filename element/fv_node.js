/**
 * The fv-node element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
const Node = Function.inherits('Hawkejs.Element.Flowview.Base', 'Node');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Node.setTemplate(`
<div class="fv-node-content">
	<div class="fv-node-title">
		Flowview Node
	</div>
	<div class="fv-node-description"></div>
	<div class="fv-node-buttons"></div>
	<div class="fv-node-anchors">
		<div class="fv-node-anchors-in"></div>
		<div class="fv-node-anchors-out"></div>
	</div>
</div>
`, true);

/**
 * The type of this node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {String}
 */
Node.setAttribute('type');

/**
 * Make this node draggable by default
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Boolean}
 */
Node.setProperty('is_draggable', true);

/**
 * Remember the config of this node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Object}
 */
Node.setAssignedProperty('config');

/**
 * The unique identifier of this node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {String}
 */
Node.setAttribute('uid');

/**
 * Title element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.addElementGetter('title_element', '.fv-node-title');

/**
 * Description element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.addElementGetter('description_element', '.fv-node-description');

/**
 * Buttons element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.addElementGetter('buttons_element', '.fv-node-buttons');

/**
 * Get the output anchor element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Array}
 */
Node.setProperty(function anchors_out() {
	return this.querySelector('.fv-node-anchors-out');
});

/**
 * Get the input anchor element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Array}
 */
Node.setProperty(function anchors_in() {
	return this.querySelector('.fv-node-anchors-in');
});

/**
 * Get the unscaled left
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Node.setProperty(function unscaled_left() {
	if (this.style.left) {
		return parseFloat(this.style.left);
	}
});

/**
 * Get the unscaled left
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Node.setProperty(function unscaled_top() {
	if (this.style.top) {
		return parseFloat(this.style.top);
	}
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Node.setProperty(function value() {

	let result = {
		uid      : this.uid,
		type     : this.type,

		// @TODO: custom inputs & outputs that can be serialized?
		inputs   : [],
		outputs  : [],

		connections : {
			in   : [],
			out  : []
		},

		pos         : {x: 0, y: 0}
	};

	let rect = this.getRectInGrid();

	let x = this.unscaled_left,
	    y = this.unscaled_top;
	
	if (x == null) {
		x = rect.x;
	}

	if (y == null) {
		y = rect.y;
	}

	result.pos.x = x;
	result.pos.y = y;

	let anchor,
	    temp,
	    i;

	for (i = 0; i < this.anchors_in.children.length; i++) {
		anchor = this.anchors_in.children[i];
		temp = anchor.value;

		if (temp && temp.connections && temp.connections.length) {
			let i;

			for (i = 0; i < temp.connections.length; i++) {
				result.connections.in.push(temp.connections[i]);
			}
		}
	}

	for (i = 0; i < this.anchors_out.children.length; i++) {
		anchor = this.anchors_out.children[i];
		temp = anchor.value;

		if (temp && temp.connections && temp.connections.length) {
			let i;

			for (i = 0; i < temp.connections.length; i++) {
				result.connections.out.push(temp.connections[i]);
			}
		}
	}

	return result;

}, function setValue(config) {

	this.assigned_data.config = config;

	if (Blast.isNode) {
		return;
	}

	this.loadConfig(config);
});

/**
 * Load the config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 *
 * @param    {String}   name
 */
Node.setMethod(async function loadConfig(config) {

	if (!this.parentElement) {
		throw new Error('Unable to set the value of a node that is not in the document');
	}

	if (config.pos) {
		this.moveTo(config.pos);
	}

	if (config.uid) {
		this.uid = config.uid;
	} else {
		this.uid = Blast.createObjectId();
	}

	if (config.type) {
		this.type = config.type;
	}

	let title = config.title || config.name;

	if (title) {
		this.title_element.textContent = title;
	}

	if (!this.grid) {
		await this.waitForTasks();
	}

	if (this.type && this.grid) {
		let list_entry = this.grid.getListEntry(this.type);
		this.list_entry = list_entry;
	} else {
		this.list_entry = null;
	}

	if (this.list_entry && this.list_entry.config) {
		if (this.list_entry.config.class) {
			let constructor = Object.path(Blast.Classes, this.list_entry.config.class);

			if (constructor) {
				this.handler = new constructor(this, config);

				if (this.handler.handles_node_loading) {
					return;
				}
			}
		}
	}

	let output,
	    input,
	    conn;

	if (config.inputs && config.inputs.length) {
		for (input of config.inputs) {
			this.addInput(input);
		}
	}

	if (config.outputs && config.outputs.length) {
		for (output of config.outputs) {
			this.addOutput(output);
		}
	}

	this.loadButtons(config.buttons);

	let connections = config.connections || false;

	if (connections.in && connections.in.length) {
		this.loadIncomingConnections(connections.in);
	}

	if (connections.out && connections.out.length) {
		this.loadOutgoingConnections(connections.out);
	}
});

/**
 * Show buttons
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 *
 * @param    {Object[]}   buttons
 */
Node.setMethod(function loadButtons(buttons) {

	Hawkejs.removeChildren(this.buttons_element);

	if (!buttons || !buttons.length) {
		return;
	}

	const that = this;
	let entry;

	for (entry of buttons) {

		let button_type;

		if (entry.href) {
			button_type = 'a';
		} else {
			button_type = 'button';
		}

		let button = this.createElement(button_type);
		button.classList.add('btn');
		button.classList.add('btn-primary');
		button.textContent = entry.title || entry.name;
		button.setAttribute('data-name', entry.name);

		if (entry.call) {
			button.addEventListener('click', function onClick(e) {
				e.preventDefault();

				let method = Object.path(Blast.Globals, entry.call);

				if (method) {
					method.call(null, that);
				}
			});
		}

		if (entry.href) {

			let url = RURL.parse(entry.href);

			if (this.type) {
				url.param('type', this.type);
			}

			if (this.uid) {
				url.param('node_uid', this.uid);
			}

			if (this.grid.grid_id) {
				url.param('grid_id', this.grid.grid_id);
			}

			button.setAttribute('href', ''+url);
		}

		this.buttons_element.append(button);
	}
});

/**
 * Get the correct draggable element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 *
 * @param    {Object}   pos
 */
Node.setMethod(function dragStart(pos, event) {

	if (event) {
		// Do not let the inputs in the "buttons_element" be a drag handle
		if (this.buttons_element.contains(event.target)) {
			return false;
		}
	}

	return this;
});

/**
 * Load incoming connections
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.2
 *
 * @param    {Object[]}   connections
 */
Node.setMethod(function loadIncomingConnections(connections) {

	if (!connections) {
		return;
	}

	if (!this.grid) {
		console.warn('Unable to load incoming connections, grid is not available yet. Node:', this);
		return;
	}

	for (let connection of connections) {
		let source_node = this.grid.getNodeByUid(connection.source.node_uid);

		if (!source_node) {
			console.warn('Connection source "' + connection.source.node_uid + '" was not found');
			continue;
		}

		this._applyConnectionToNode(source_node, this, connection);
	}
});

/**
 * Load outgoing connections
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 *
 * @param    {Object[]}   connections
 */
Node.setMethod(function loadOutgoingConnections(connections) {

	if (!connections) {
		return;
	}

	for (let connection of connections) {
		let target_node = this.grid.getNodeByUid(connection.target.node_uid);

		if (!target_node) {
			console.warn('Connection target "' + connection.target.node_uid + '" was not found');
			continue;
		}

		this._applyConnectionToNode(this, target_node, connection);
	}
});

/**
 * Connect the actual nodes
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {FvNode}   source_node
 * @param    {FvNode}   target_node
 * @param    {Object}   connection
 *
 * @return   {Boolean}
 */
Node.setMethod(function _applyConnectionToNode(source_node, target_node, connection) {

	let source_anchor = source_node.getAnchorByName(connection.source.anchor_name),
		target_anchor = target_node.getAnchorByName(connection.target.anchor_name);

	if (!source_anchor) {
		console.warn('Failed to find source anchor "' + connection.source.anchor_name + '"');
		return false;
	}

	if (!target_anchor) {
		console.warn('Failed to find target anchor "' + connection.target.anchor_name + '"');
		return false;
	}

	source_anchor.connectTo(target_anchor);

	return true;
});

/**
 * Get an anchor by its name
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name
 *
 * @return   {FvAnchor}
 */
Node.setMethod(function getAnchorByName(name) {

	let anchor = this.querySelector('fv-anchor-input[name="' + name + '"], fv-anchor-output[name="' + name + '"]');

	return anchor;
});

/**
 * Add an output
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function addOutput(config) {

	let anchor = this.createElement('fv-anchor-output');

	anchor.owner_node = this;

	let name = config.name,
	    title = config.title || name;

	anchor.name = name;
	anchor.config = config;
	anchor.textContent = title;

	this.anchors_out.append(anchor);
});

/**
 * Add an input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function addInput(config) {

	let anchor = this.createElement('fv-anchor-input');

	anchor.owner_node = this;

	let name = config.name,
	    title = config.title || name;

	anchor.name = name;
	anchor.config = config;
	anchor.textContent = title;

	this.anchors_in.append(anchor);
});

/**
 * Get an output anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Node.setMethod(function getOutput(name) {
	return this.anchors_out.querySelector('fv-anchor-output[name="' + name + '"]');
});

/**
 * Get an input anchor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Node.setMethod(function getInput(name) {
	return this.anchors_in.querySelector('fv-anchor-input[name="' + name + '"]');
});

/**
 * Remove an output
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Node.setMethod(function removeOutput(name) {

	let anchor = this.getOutput(name);

	if (anchor) {
		anchor.destroy();
	}
});

/**
 * Remove an input
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Node.setMethod(function removeInput(name) {

	let anchor = this.getInput(name);

	if (anchor) {
		anchor.destroy();
	}
});

/**
 * Redraw this node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function redraw() {

	let i;

	for (i = 0; i < this.anchors_out.children.length; i++) {
		this.anchors_out.children[i].redraw();
	}

	for (i = 0; i < this.anchors_in.children.length; i++) {
		this.anchors_in.children[i].redraw();
	}

});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
Node.setMethod(function introduced() {

	if (!this.uid) {
		this.uid = Blast.createObjectId();
	}

	this.addEventListener('contextmenu', e => {

		let menu = this.createElement('he-context-menu');
		menu.addEntry('Delete', click_event => {
			this.destroy();
		});

		menu.show(e);
	});
});

/**
 * Destroy this node, detach all paths and queue a redraw
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Node.setMethod(function destroy() {

	let i;

	for (i = 0; i < this.anchors_out.children.length; i++) {
		this.anchors_out.children[i].detachPaths();
	}

	for (i = 0; i < this.anchors_in.children.length; i++) {
		this.anchors_in.children[i].detachPaths();
	}

	const grid = this.grid;

	this.remove();

	if (grid) {
		grid.queueRedraw();
	}
});