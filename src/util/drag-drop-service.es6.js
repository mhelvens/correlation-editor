const _inTheAir = Symbol('_inTheAir');

export class DragDropService {

	constructor() {
		this[_inTheAir] = {};
	}

	sender({resource, effectAllowed, dragstart, dragend}) {
		return (event) => {
			let response;
			switch (event.type) {
				case 'dragstart': {
					response = dragstart && dragstart();
					let key = resource.id;
					this[_inTheAir][key] = resource;
					event.dataTransfer.setData(`x-resource/${resource.type}`, key);
				} break;
				case 'dragend': {
					response = dragend();
					delete this[_inTheAir][key];
				} break;
			}
			if (response === false) {
				event.preventDefault();
				event.stopPropagation();
			}
		};
	}

	recipient({acceptedTypes, dragenter, dragleave, drop}) {
		return (event) => {
			for (let type of acceptedTypes) {
				if (event.dataTransfer.getData(`x-resource/${type}`)) { // TODO: make sure this is automatically lowercased, like the sender-side
					let key      = event.dataTransfer.getData(`x-resource/${type}`);
					let resource = this[_inTheAir][key];
					let response;
					switch (event.type) {
						case 'dragenter': { response = dragenter && dragenter(resource) } break;
						case 'dragleave': { response = dragleave && dragleave(resource) } break;
						case 'drop':      { response = drop      && drop     (resource) } break;
					}
					if (response === false) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		};
	}

}

// TODO: use this service to clean up drag/drop code
