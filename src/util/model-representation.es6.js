const model = Symbol('model');

export class ModelRepresentation {

	model;

	constructor({resources}) {
		this.resources = resources;
	}
	ngOnChanges({modelId}) {
		if (modelId) {
			this.model = this.resources.getResource_sync(this.constructor.endpoint, modelId.currentValue);
			if (!this.model) {
				console.dir(modelId);
			}
		}
	}
}
