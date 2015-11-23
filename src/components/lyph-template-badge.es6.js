import {Component, EventEmitter, Inject} from 'angular2/angular2';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js';
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';

@Component({
	selector: 'lyph-template-badge',
	inputs:   ['modelId', 'highlight'],
	events:   ['select', 'dragging'],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	host: {
		'[class.resource-badge]':  ' true                                                   ',
		'[title]':                 ' model.name                                             ',
		'[inner-html]':            ' model.name | escapeHTML | underlineSubstring:highlight ',
		'(click)':                 ` select.next(model); $event.stopPropagation();          `,
		...DragDropService.canBeDragged('dds')
	},
	template: ``,
	styles: [`
		:host       { background-color: #fee !important }
		:host:hover { background-color: #fcc !important }
	`]
})
export class LyphTemplateBadge extends ModelRepresentation {

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
