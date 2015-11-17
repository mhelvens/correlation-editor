import ng from 'angular2/angular2';

import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {
	draggableResourceHostAttributes,
	DraggableResource
} from '../util/draggable-resource.es6.js';

export const LyphTemplateBadge = ng.Component({
	selector: 'lyph-template-badge',
	inputs:   ['model', 'highlight'],
	events: ['select', 'foo'],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	host: {
		'[class.resource-badge]':  '  true                                                  ',
		'[title]':                 ' model.name                                             ',
		'[inner-html]':            ' model.name | escapeHTML | underlineSubstring:highlight ',
		'(click)':                 ` select.next(model); $event.stopPropagation();          `,
		...draggableResourceHostAttributes
	},
	template: ``,
	styles: [`
		:host       { background-color: #fee !important }
		:host:hover { background-color: #fcc !important }
	`]
}).Class({

	constructor() {
		this.select = new ng.EventEmitter();


		this.foo = new ng.EventEmitter();

	},

	...DraggableResource('lyphtemplate', 'model')

});
