export const resourceDropAreaHostAttributes = {
	'(dragenter)': ' dragenter($event) ',
	'(dragleave)': ' dragleave($event) ',
	'(dragover)':  ' dragover ($event) ',
	'(drop)':      ' drop     ($event) '
};

export const ResourceDropArea = (types, {dragenter, dragleave, dragover, drop} = {}) => ({

	dragenter(event) {
		let type;
		for (let t of types) {
			if (event.dataTransfer.types.includes(`x-resource/${t}`)) {
				type = t;
				break;
			}
		}
		if (!type) { return }
		event.dataTransfer.dropEffect = 'link';
		event.preventDefault();
		event.stopPropagation();
		if (type && typeof this.resourceDragEnter === 'function') {
			this.resourceDragEnter(event.dataTransfer);
		}
	},

	dragleave(event) {
		let type;
		for (let t of types) {
			if (event.dataTransfer.types.includes(`x-resource/${t}`)) {
				type = t;
				break;
			}
		}
		if (!type) { return }
		event.preventDefault();
		event.stopPropagation();
		if (type && typeof this.resourceDragLeave === 'function') {
			this.resourceDragLeave(event.dataTransfer);
		}
	},

	dragover(event) {
		let type;
		for (let t of types) {
			if (event.dataTransfer.types.includes(`x-resource/${t}`)) {
				type = t;
				break;
			}
		}
		if (!type) { return }
		event.stopPropagation();
		event.preventDefault();
		if (type && typeof this.resourceDragOver === 'function') {
			this.resourceDragOver(event.dataTransfer);
		}
	},

	drop(event) {
		let type;
		for (let t of types) {
			if (event.dataTransfer.types.includes(`x-resource/${t}`)) {
				type = t;
				break;
			}
		}
		if (!type) { return }
		event.preventDefault();
		event.stopPropagation();
		if (type && typeof this.resourceDrop === 'function') {
			this.resourceDrop(JSON.parse(event.dataTransfer.getData(`x-resource/${type}`)), type);
		}
	}

});
