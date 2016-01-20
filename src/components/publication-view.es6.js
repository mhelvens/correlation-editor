import {Component, EventEmitter} from 'angular2/core';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {Resources}              from '../util/resources.es6.js';


@Component({
	selector: 'publication-view',
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['modelId', 'highlight'],
	events: ['choose', 'dragging'],
	host: {
		'[class.resource-view]': ` true               `,
		'[title]':               ` compositeTitle     `,
		'(click)':               ` choose.next({event: $event, model: model}) `,
		...DragDropService.canBeDragged('dds')
	},
	template: `

		<div class="icon icon-Publication"></div>
		<div class="text-content" [innerHtml]="compositeTitle | escapeHTML | underlineSubstring:highlight"></div>
		<a *ngIf = "uriIsUrl()"
		   class  = "link glyphicon glyphicon-new-window"
		   [href] = "model.uri"
		   target = "_blank"></a>

	`,
	styles: [`

		:host       { background-color: #eff !important }
		:host:hover { background-color: #cff !important }

		:host .text-content {
			font-style: italic;
		}

	`]
})
export class PublicationView extends ModelRepresentation {

	static endpoint = 'publications';

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

	get compositeTitle() {
		if (!this.model)       { return "" }
		if (!this.model.title) { return this.model.uri }

		/* extract pubmed-id if applicable */
		let match = this.model.uri.match(/^https?\:\/\/www\.ncbi\.nlm\.nih\.gov\/pubmed\/\?term\=(\w+)/);
		if (match) { return `${this.model.title} (${match[1]})` }

		return this.model.title;
	}

	uriIsUrl() { return /^https?\:\/\//.test(this.model ? this.model.uri : '') }

}
