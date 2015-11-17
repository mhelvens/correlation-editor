import ng from 'angular2/angular2';

export const EscapeHtmlPipe = ng.Pipe({
	name: 'escapeHTML'
}).Class({
	constructor() {},
	transform(html) {
		return html
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
});
