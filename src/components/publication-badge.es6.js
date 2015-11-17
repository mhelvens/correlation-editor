import ng from 'angular2/angular2';

import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {
	draggableResourceHostAttributes,
	DraggableResource
} from '../util/draggable-resource.es6.js';

export const PublicationBadge = ng.Component({
	selector: 'publication-badge',
	inputs:   ['model', 'highlight'],
	events: ['select'],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	host: {
		'[class.resource-badge]':  `  true                                                                  `,
		'[title]':                 `  model.title || model.uri                                              `,
		'[inner-html]':            ` (model.title || model.uri) | escapeHTML | underlineSubstring:highlight `,
		'(click)':                 ` select.next(model); $event.stopPropagation();                          `,
		...draggableResourceHostAttributes
	},
	template: ``,
	styles: [`
		:host       { background-color: #eff !important }
		:host:hover { background-color: #cff !important }
	`]
}).Class({

	constructor() {
		this.select = new ng.EventEmitter();
	},

	...DraggableResource('publication', 'model')

});
