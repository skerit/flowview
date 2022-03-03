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

	result.pos.x = rect.x;
	result.pos.y = rect.y;

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

	Hawkejs.removeChildren(this.buttons_element);

	if (config.buttons && config.buttons.length) {
		const that = this;
		let entry;

		for (entry of config.buttons) {

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
	}

	let connections = config.connections || false;

	if (connections.in && connections.in.length) {
		for (conn of connections.in) {

			let node = this.grid.getNodeByUid(conn.source.node_uid);

			if (!node) {
				console.warn('Connection source "' + conn.source.node_uid + '" was not found');
				continue;
			}

			let source_anchor = node.getAnchorByName(conn.source.anchor_name),
			    target_anchor = this.getAnchorByName(conn.target.anchor_name);

			if (!source_anchor) {
				console.warn('Failed to find source anchor "' + conn.source.anchor_name + '"');
				continue;
			}

			if (!target_anchor) {
				console.warn('Failed to find target anchor "' + conn.target.anchor_name + '"');
				continue;
			}

			source_anchor.connectTo(target_anchor);
		}
	}

	if (connections.out && connections.out.length) {
		for (conn of connections.out) {

			let node = this.grid.getNodeByUid(conn.target.node_uid);

			if (!node) {
				console.warn('Connection target "' + conn.target.node_uid + '" was not found');
				continue;
			}

			let source_anchor = this.getAnchorByName(conn.source.anchor_name),
			    target_anchor = node.getAnchorByName(conn.target.anchor_name);

			if (!source_anchor) {
				console.warn('Failed to find source anchor "' + conn.source.anchor_name + '"');
				continue;
			}

			if (!target_anchor) {
				console.warn('Failed to find target anchor "' + conn.target.anchor_name + '"');
				continue;
			}

			source_anchor.connectTo(target_anchor);
		}
	}
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
 * @version  0.1.0
 */
Node.setMethod(function introduced() {

	if (!this.uid) {
		this.uid = Blast.createObjectId();
	}

});