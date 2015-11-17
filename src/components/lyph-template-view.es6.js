import ng from 'angular2/angular2';

import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {
	draggableResourceHostAttributes,
	DraggableResource
} from '../util/draggable-resource.es6.js';



export const LyphTemplateView = ng.Component({
	selector: '[lyph-template]',
	inputs:   ['model: lyphTemplate', 'highlight'],
	events: ['select'],
	host: {
		'[style.borderColor]': ` "#999"     `,
		'[title]':             ` model.name `,
		...draggableResourceHostAttributes
	},
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	template: `

		<div class="resource-view" (click)="select.next(model)">
			<div class="icon icon-artery"></div>
			<div class="text-content" [inner-html]="model.name | escapeHTML | underlineSubstring:highlight"></div>
		</div>

	`,
	styles: [`

		:host       { background-color: #fee !important }
		:host:hover { background-color: #fcc !important }

		div.resource-view > div.text-content {
			font-weight: bold;
		}

	`]
}).Class({

	constructor() {
		this.select = new ng.EventEmitter();
	},

	...DraggableResource('lyphtemplate', 'model')

});
