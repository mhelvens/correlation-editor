import ng from 'angular2/angular2';

import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';


export const LyphTemplateView = ng.Component({
	selector: '[lyph-template]',
	inputs:   ['model: lyphTemplate', 'highlight'],
	events: ['select', 'dragging'],
	host: {
		'[style.borderColor]': ` "#999"     `,
		'[title]':             ` model.name `,
		...DragDropService.canBeDragged('dds')
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

		:host  .text-content {
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
