import {NgIf, NgFor, Component, EventEmitter, Inject} from 'angular2/angular2';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';


@Component({
	selector: 'lyph-template-view',
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['modelId', 'highlight'],
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
})
export class LyphTemplateView extends ModelRepresentation {

	static endpoint = 'lyphTemplates';

	select   = new EventEmitter;
	dragging = new EventEmitter;

	constructor(@Inject(DragDropService) dd) {
		super();
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}

}
