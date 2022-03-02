/**
 * The fv-list-entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var ListEntry = Function.inherits('Hawkejs.Element.Flowview.Base', function ListEntry() {
	ListEntry.super.call(this);
	this.setAttribute('draggable', 'true');
});

/**
 * The hawkejs template to use
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
ListEntry.setTemplateFile('flowview/fv_list_entry');

/**
 * The type of this entry
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
ListEntry.setAttribute('type');

/**
 * The data of this entry
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
ListEntry.setAssignedProperty('config');

/**
 * Added to the dom for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 */
ListEntry.setMethod(function introduced() {

	const that = this;

	let add_button = this.querySelector('.add-to-grid');

	add_button.addEventListener('click', function onClick(e) {
		e.preventDefault();

		let grid = that.grid;

		if (grid) {
			grid.addNode({type: that.type});
		}
	});

	this.addEventListener('dragstart', function onDragStart(e) {

		let data = e.dataTransfer;

		data.setData('application/flowview_component', that.type);
	}, false);

});