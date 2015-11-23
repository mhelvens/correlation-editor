import {Pipe} from 'angular2/angular2';


@Pipe({ name: 'escapeHTML' })
export class EscapeHtmlPipe {
	transform(html) {
		return html
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
}
