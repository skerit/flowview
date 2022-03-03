/**
 * The fv-list element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var List = Function.inherits('Hawkejs.Element.Flowview.Base', function List() {
	List.super.call(this);

	let components = this.createElement('div');
	components.classList.add('components');
	this.append(components);
});

/**
 * The data of this entry
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
List.setAssignedProperty('component_data', null, function setNewValue(components) {

	Hawkejs.removeChildren(this.components_element);

	if (components == null) {
		return;
	}

	let i;

	for (i = 0; i < components.length; i++) {
		this.addComponent(components[i]);
	}

});

/**
 * Inner wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
List.addElementGetter('components_element', '.components');

/**
 * The remote url attribute
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
List.setAttribute('src');

/**
 * Load remote content
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 *
 * @return   {Pledge}
 */
List.setMethod(function loadRemote() {

	if (this.loading) {
		return this.loading;
	}

	let url = this.src;

	if (!url) {
		return;
	}

	let pledge = new Classes.Pledge();
	
	this.loading = pledge;

	if (!url) {
		pledge.resolve(false);
		return pledge;
	}

	const that = this;

	this.hawkejs_helpers.Alchemy.getResource({
		href : url,
	}, function gotResponse(err, data, xhr) {

		if (err) {
			return pledge.reject(err);
		}

		let i;

		for (i = 0; i < data.components.length; i++) {
			that.addComponent(data.components[i]);
		}

		pledge.resolve(data);

	});

	return pledge;
});

/**
 * Add a component to the list
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
List.setMethod(function addComponent(data) {

	let entry = this.createElement('fv-list-entry');

	entry.type = data.name;
	entry.config = data;

	this.components_element.append(entry);

});

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
List.setMethod(function introduced() {

	if (!this.component_data) {
		this.loadRemote();
	}
});