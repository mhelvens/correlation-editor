const _inTheAir = Symbol('_inTheAir');

export class DragDropService {

	constructor() {
		this[_inTheAir] = {};
	}

	sender(context, {resourceKey, effectAllowed, dragstart, dragend}) {
		return (event) => {
			let response;
			let resource = context[resourceKey];
			let key      = JSON.stringify(resource); // TODO: this is for backwards compatibility; should later be changed to resource.id
			switch (event.type) {
				case 'dragstart': {
					response = dragstart && dragstart.call(context);
					this[_inTheAir][key] = resource;
					event.dataTransfer.setData(`x-resource/${resource.type.toLowerCase()}`, key);
				} break;
				case 'dragend': {
					response = dragend && dragend.call(context); // TODO: return success or failure status from recipient
					delete this[_inTheAir][key];
				} break;
			}
			if (response === false) {
				event.effectAllowed = effectAllowed;
				event.stopPropagation();
			}
		};
	}

	recipient(context, {acceptedTypes, dropEffect, dragenter, dragleave, dragover, drop}) {
		return (event) => {
			for (let type of acceptedTypes) {
				if (event.dataTransfer.types.includes(`x-resource/${type.toLowerCase()}`)) {
					let key = event.dataTransfer.getData(`x-resource/${type.toLowerCase()}`);
					let resource = this[_inTheAir][key];
					let response;
					switch (event.type) {
						case 'dragover':  { response = dragover  && dragover .call(context) } break;
						case 'dragenter': { response = dragenter && dragenter.call(context) } break;
						case 'dragleave': { response = dragleave && dragleave.call(context) } break;
						case 'drop':      { response = drop      && drop     .call(context, resource || JSON.parse(key)) } break; // TODO: this is for backwards compatibility; should later remove '|| JSON.parse(key)'
					}
					if (response === false) {
						if (event.type === 'dragenter' || event.type === 'dragover') {
							event.dataTransfer.dropEffect = dropEffect;
							event.preventDefault();
						}
						event.stopPropagation();
					}
				}
			}
		};
	}

}

// TODO: use this service to clean up drag/drop code across the project
