import ng from 'angular2/angular2';

import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';


export const LyphTemplateView = ng.Component({
	selector: 'lyph-template-view',
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['model', 'highlight'],
	events: ['select', 'dragging'],
	host: {
		'[class.resource-view]': ` true               `,
		'[title]':               ` model.name         `,
		'(click)':               ` select.next(model) `,
		...DragDropService.canBeDragged('dds')
	},
	template: `

		<div class="icon icon-LyphTemplate"></div>
		<div class="text-content" [inner-html]="model.name | escapeHTML | underlineSubstring:highlight"></div>

	`,
	styles: [`

		:host       { background-color: #fee !important }
		:host:hover { background-color: #fcc !important }

		:host .text-content {
			font-weight: bold;
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
	}]

});
