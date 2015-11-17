import ng from 'angular2/angular2';

export const FieldSubstringPipe = ng.Pipe({
	name: 'fieldSubstring'
}).Class({
	constructor() {},
	transform(list, [filterText, string, flags = {}]) {
		return list.filter(item => (filterText(item, flags) || "").toLowerCase().includes((string || "").trim().toLowerCase()));
	}
});
