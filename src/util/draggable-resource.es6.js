export const draggableResourceHostAttributes = {
	'[draggable]': ' true              ',
	'(dragstart)': ' dragstart($event) ',
	'(dragend)':   ' dragend  ($event) '
};

export const DraggableResource = (type, modelKey, {dragstart, dragend} = {}) => ({

	dragstart(event) {
		event.dataTransfer.effectAllowed = 'link';
		event.dataTransfer.setData(`x-resource/${type}`, JSON.stringify(this[modelKey]));
		event.dataTransfer.setData('text/plain',         JSON.stringify(this[modelKey]));
		if (dragstart) { dragstart.call(this, event) }
	},

	dragend(event) {
		if (dragend) { dragend.call(this, event) }
	}

});
