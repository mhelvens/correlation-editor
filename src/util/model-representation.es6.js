import {getResource_sync} from './resources.es6.js';

export class ModelRepresentation {
	onChanges({modelId}) {
		if (modelId) {
			this.model = getResource_sync(this.constructor.endpoint, modelId.currentValue);
		}
	}
}
