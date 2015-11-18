import ng from 'angular2/angular2';

import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';


export const PublicationBadge = ng.Component({
	selector: 'publication-badge',
	inputs:   ['model', 'highlight'],
	events:   ['select', 'dragging'],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	host: {
		'[class.resource-badge]':  `  true                                                                  `,
		'[title]':                 `  model.title || model.uri                                              `,
		'[inner-html]':            ` (model.title || model.uri) | escapeHTML | underlineSubstring:highlight `,
		'(click)':                 ` select.next(model); $event.stopPropagation();                          `,
		...DragDropService.canBeDragged('dds')
	},
	template: ``,
	styles: [`
		:host       { background-color: #eff !important }
		:host:hover { background-color: #cff !important }
	`]
}).Class({

	constructor: [DragDropService, function(dd) {
		this.select = new ng.EventEmitter();
		this.dragging = new ng.EventEmitter();
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}]

});
