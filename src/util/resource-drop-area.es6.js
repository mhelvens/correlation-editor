export const resourceDropAreaHostAttributes = {
	'(dragenter)': ' dragenter($event) ',
	'(dragleave)': ' dragleave($event) ',
	'(dragover)':  ' dragover ($event) ',
	'(drop)':      ' drop     ($event) '
};

export const ResourceDropArea = (...types) => ({

	dragenter(event) {
		for (let type of types) {
			if (event.dataTransfer.types.includes(`x-resource/${type}`)) {
				event.dataTransfer.dropEffect = 'link';
				event.preventDefault();
				if (typeof this.resourceDragEnter === 'function') {
					this.resourceDragEnter(event.dataTransfer);
					return;
				}
			}
		}
	},

	dragleave(event) {
		for (let type of types) {
			if (event.dataTransfer.types.includes(`x-resource/${type}`)) {
				event.dataTransfer.dropEffect = 'link';
				event.preventDefault();
				if (typeof this.resourceDragLeave === 'function') {
					this.resourceDragLeave(event.dataTransfer);
					return;
				}
			}
		}
	},

	dragover(event) {
		for (let type of types) {
			if (event.dataTransfer.types.includes(`x-resource/${type}`)) {
				event.dataTransfer.dropEffect = 'link';
				event.preventDefault();
			}
		}
	},

	drop(event) {
		for (let type of types) {
			if (event.dataTransfer.types.includes(`x-resource/${type}`)) {
				event.preventDefault();
				if (typeof this.resourceDrop === 'function') {
					this.resourceDrop(JSON.parse(event.dataTransfer.getData(`x-resource/${type}`)), type);
					return;
				}
			}
		}
	}

});
