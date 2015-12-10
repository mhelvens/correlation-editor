export const request = require('../libs/superagent.es6.js');
import {sw} from '../util/misc.es6.js';

request.basePath = 'http://localhost:8888';

const fetchResources = Symbol('fetchResources');
const models         = Symbol('models');
const modelLists     = Symbol('modelLists');

export class Resources {

	constructor() {
		this[models]     = {};
		this[modelLists] = {};
	}

	async [fetchResources](type) {
		if (!this[models][type] && !this[modelLists][type]) {
			this[modelLists][type] = await request.get(`/${type}`).then(v => v.body);
			this[models][type] = {};
			for (let model of this[modelLists][type]) {
				this[models][type][model.id] = model;
			}
		}
	}

	async preloadAllResources() {
		await this[fetchResources]('publications');
		await this[fetchResources]('clinicalIndices');
		await this[fetchResources]('locatedMeasures');
		await this[fetchResources]('lyphTemplates');
		await this[fetchResources]('correlations');
	}

	getAllResources_sync() {
		return this[modelLists];
	}

	getResource_sync(type, ids) {
		if (Array.isArray(ids)) {
			return ids.map(id => this[models][type][id]);
		} else {
			return this[models][type][ids];
		}
	}

	async updateResource(id, resource) {
		let endpoint = sw(resource.type)({
			'Publication':    'publications',
			'ClinicalIndex':  'clinicalIndices',
			'LocatedMeasure': 'locatedMeasures',
			'LyphTemplate':   'lyphTemplates',
			'Correlation':    'correlations'
		});
		let newResource = (await request.post(`/${endpoint}/${id}`).send(resource)).body[0];
		Object.assign(this[models][endpoint][id], newResource);
		return newResource;
	}

	async addNewResource(resource) {
		let endpoint = sw(resource.type)({
			'Publication':    'publications',
			'ClinicalIndex':  'clinicalIndices',
			'LocatedMeasure': 'locatedMeasures',
			'LyphTemplate':   'lyphTemplates',
			'Correlation':    'correlations'
		});
		let newResource = (await request.post(`/${endpoint}`).send(resource)).body[0];
		this[models][endpoint][newResource.id] = newResource;
		this[modelLists][endpoint] = [...this[modelLists][endpoint], newResource];
		return newResource;
	}

	async deleteResource(resource) {
		let endpoint = sw(resource.type)({
			'Publication':    'publications',
			'ClinicalIndex':  'clinicalIndices',
			'LocatedMeasure': 'locatedMeasures',
			'LyphTemplate':   'lyphTemplates',
			'Correlation':    'correlations'
		});

		this[modelLists][endpoint] = this[modelLists][endpoint].filter(({id}) => id !== resource.id);
		delete this[models][endpoint][resource.id];
		await request.delete(`/${endpoint}/${resource.id}`);
	}

}
