import ng from 'angular2/angular2';

import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {getResource_sync}       from '../util/resources.es6.js';

import {
	draggableResourceHostAttributes,
	DraggableResource
} from '../util/draggable-resource.es6.js';

export const LocatedMeasureBadge = ng.Component({
	selector: 'located-measure-badge',
	inputs:   ['model', 'highlight'],
	events: ['select'],
	host: {
		'[class.resource-badge]':  `  true                                             `,
		'[title]':                 ` model.quality + ' of ' + lyphTemplateModel().name `,
		'(click)':                 ` select.next(model); $event.stopPropagation();     `,
		...draggableResourceHostAttributes
	},
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	template: `

		<span [inner-html]="model.quality            | escapeHTML | underlineSubstring:highlight"></span>
		<span style="font-weight: normal">of</span>
		<span [inner-html]="lyphTemplateModel().name | escapeHTML | underlineSubstring:highlight"></span>

	`,
	styles: [`
		:host       { background-color: #efe !important }
		:host:hover { background-color: #cfc !important }
	`]
}).Class({

	constructor() {
		this.select = new ng.EventEmitter();
	},

	lyphTemplateModel() {
		return getResource_sync('lyphTemplates', this.model.lyphTemplate);
	},

	...DraggableResource('locatedmeasure', 'model')

});
