import ng from 'angular2/angular2';

import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';


export const PublicationView = ng.Component({
	selector: 'publication-view',
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['model', 'highlight'],
	events: ['select', 'dragging'],
	host: {
		'[class.resource-view]': ` true                     `,
		'[title]':               ` model.title || model.uri `,
		'(click)':               ` select.next(model)       `,
		...DragDropService.canBeDragged('dds')
	},
	template: `

		<div class="icon icon-Publication"></div>
		<div class="text-content" [inner-html]="(model.title || model.uri) | escapeHTML | underlineSubstring:highlight"></div>
		<a *ng-if = "uriIsUrl()"
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
}).Class({

	constructor: [DragDropService, function(dd) {
		this.select   = new ng.EventEmitter();
		this.dragging = new ng.EventEmitter();
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}],

	uriIsUrl() { return /^https?\:\/\//.test(this.model.uri) }

});
