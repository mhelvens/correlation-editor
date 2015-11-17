import request from '../libs/superagent.es6.js';

request.basePath = 'http://localhost:8888';

let modelLists = {};
let models     = {};

async function _fetchResources(type) {
	if (!models[type] && !modelLists[type]) {
		modelLists[type] = await request.get(`/${type}`).then(({body}) => body);
		models[type] = {};
		for (let model of modelLists[type]) {
			models[type][model.id] = model;
		}
	}
}

export async function preloadAllResources() {
	await _fetchResources('publications');
	await _fetchResources('clinicalIndices');
	await _fetchResources('locatedMeasures');
	await _fetchResources('lyphTemplates');
	await _fetchResources('correlations');
}

export function getAllResources_sync(type) {
	return modelLists[type];
}

export function getResource_sync(type, ids) {
	if (Array.isArray(ids)) {
		return ids.map(id => models[type][id]);
	} else {
		return models[type][ids];
	}
}
