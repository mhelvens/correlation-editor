export const debugPromise = (marker) => [
	(data) => { console.log  (`(${marker}) RESOLVED:`, JSON.stringify(data)); return data; },
	(data) => { console.error(`(${marker}) REJECTED:`, JSON.stringify(data)); throw  data; }
];

export function toCamelCase(str) {
	return str
		.replace(/\s(.)/g, l => l.toUpperCase())
		.replace(/\s/g,    ''                  )
		.replace(/^(.)/,   l => l.toLowerCase());
}

export function def(object, field, defaultValue) {
	if (typeof object[field] === 'undefined') {
		object[field] = defaultValue;
	}
	return object[field];
}

export const a = (object, field) => def(object, field, []);
export const o = (object, field) => def(object, field, {});

export const sw = (val) => (map) => ( (val in map) ? map[val] : map.default );
