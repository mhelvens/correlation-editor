import {Component, EventEmitter, Inject} from 'angular2/core';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {Resources}              from '../util/resources.es6.js';

@Component({
	selector: 'clinical-index-view',
	directives: [],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['modelId', 'highlight'],
	events: ['choose', 'dragging'],
	host: {
		'[class.resource-view]': ` true                     `,
		'[title]':               ` model.title || model.uri `,
		'(click)':               ` choose.next({event: $event, model: model})       `,
		...DragDropService.canBeDragged('dds')
	},
	template: `

		<div class="icon icon-ClinicalIndex"></div>
		<div class="text-content">
			<span [innerHtml]="(model.title || model.uri) | escapeHTML | underlineSubstring:highlight"></span>
			(<span [innerHtml]="model.id.toString() | escapeHTML | underlineSubstring:highlight"></span>)
		</div>
		<a *ngIf = "uriIsUrl()"
		   class  = "link glyphicon glyphicon-new-window"
		   [href] = "model.uri"
		   target = "_blank"></a>

	`,
	styles: [`

		:host       { background-color: #ffe !important }
		:host:hover { background-color: #ffc !important }

		:host > div {
			pointer-events: none;
		}

	`]
})
export class ClinicalIndexView extends ModelRepresentation {

	static endpoint = 'clinicalIndices';

	choose   = new EventEmitter;
	dragging = new EventEmitter;

	constructor(dd: DragDropService, resources: Resources) {
		super({resources});
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}

	uriIsUrl() { return /^https?:\/\//.test(this.model.uri) }

}
