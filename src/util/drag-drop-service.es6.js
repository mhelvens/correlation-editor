const _inTheAir = Symbol('_inTheAir');

export class DragDropService {

	sender(context, {resourceKey, effectAllowed, dragstart, dragend}) {
		return (event) => {
			let response;
			let resource = context[resourceKey];
			switch (event.type) {
				case 'dragstart': {
					response = dragstart && dragstart.call(context);
					this[_inTheAir] = resource;
					event.dataTransfer.setData(`x-resource/${resource.type.toLowerCase()}`, null);
					event.dataTransfer.setData(`application/json`, JSON.stringify(resource));
					event.dataTransfer.setData(`text/plain`,       JSON.stringify(resource));
				} break;
				case 'dragend': {
					response = dragend && dragend.call(context);
					delete this[_inTheAir];
				} break;
			}
			if (response === false) {
				event.effectAllowed = effectAllowed;
				event.stopPropagation();
			}
		};
	}

	recipient(context, options) {
		let {acceptedTypes, dropEffect} = options;
		return (event) => {
			for (let type of acceptedTypes) {
				if (Array.from(event.dataTransfer.types).includes(`x-resource/${type.toLowerCase()}`)) {
					let resource = this[_inTheAir];
					let response = options[event.type] && options[event.type].call(context, resource);
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

DragDropService.canBeDragged = (dds) => ({
	'[draggable]': ` true           `,
	'(dragstart)': ` ${dds}($event) `,
	'(dragend)':   ` ${dds}($event) `
});

DragDropService.acceptsDrop = (ddr) => ({
	'(dragover)':  ` ${ddr}($event) `,
	'(dragenter)': ` ${ddr}($event) `,
	'(dragleave)': ` ${ddr}($event) `,
	'(drop)':      ` ${ddr}($event) `
});
