import {NgIf, NgFor, Component, EventEmitter, Inject} from 'angular2/angular2';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';

@Component({
	selector: 'clinical-index-view',
	directives: [
		NgIf
	],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['modelId', 'highlight'],
	events: ['select', 'dragging'],
	host: {
		'[class.resource-view]': ` true                     `,
		'[title]':               ` model.title || model.uri `,
		'(click)':               ` select.next(model)       `,
		...DragDropService.canBeDragged('dds')
	},
	template: `

		<div class="icon icon-ClinicalIndex"></div>
		<div class="text-content" [inner-html]="(model.title || model.uri) | escapeHTML | underlineSubstring:highlight"></div>
		<a *ng-if = "uriIsUrl()"
		   class  = "link glyphicon glyphicon-new-window"
		   [href] = "model.uri"
		   target = "_blank"></a>

	`,
	styles: [`

		:host       { background-color: #ffe !important }
		:host:hover { background-color: #ffc !important }

	`]
})
export class ClinicalIndexView extends ModelRepresentation {

	static endpoint = 'clinicalIndices';

	select   = new EventEmitter;
	dragging = new EventEmitter;

	constructor(@Inject(DragDropService) dd) {
		super();
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}

	uriIsUrl() { return /^https?:\/\//.test(this.model.uri) }

}
