import request from 'superagent';
require('superagent-as-promised')(request);

const basePath = Symbol('basePath');

export default {
	set basePath(bp) { this[basePath] = bp   },
	get basePath()   { return this[basePath] },
	get   (path)     { return request.get   (this[basePath] + path) },
	post  (path)     { return request.post  (this[basePath] + path) },
	put   (path)     { return request.put   (this[basePath] + path) },
	delete(path)     { return request.delete(this[basePath] + path) }
}
