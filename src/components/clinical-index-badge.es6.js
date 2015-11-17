import ng from 'angular2/angular2';

import {UnderlineSubstringPipe}                             from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}                                     from '../util/escape-html-pipe.es6.js';
import {draggableResourceHostAttributes, DraggableResource} from '../util/draggable-resource.es6.js';

export const ClinicalIndexBadge = ng.Component({
	selector: 'clinical-index-badge',
	inputs:   ['model', 'highlight'],
	events:   ['select', 'dragging'],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	host: {
		'[class.resource-badge]': `  true                                                                  `,
		'[title]':                `  model.title || model.uri                                              `,
		'[inner-html]':           ` (model.title || model.uri) | escapeHTML | underlineSubstring:highlight `,
		'(click)':                ` select.next(model); $event.stopPropagation();                          `,
		...draggableResourceHostAttributes
	},
	template: ``,
	styles: [`
		:host       { background-color: #ffe !important }
		:host:hover { background-color: #ffc !important }
	`]
}).Class({

	constructor() {
		this.select   = new ng.EventEmitter();
		this.dragging = new ng.EventEmitter();
	},

	...DraggableResource('clinicalindex', 'model', {
		dragstart() { this.dragging.next(this.model) },
		dragend()   { this.dragging.next(null)       }
	})

});
