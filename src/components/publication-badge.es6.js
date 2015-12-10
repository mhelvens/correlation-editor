import {Component, EventEmitter, Inject} from 'angular2/angular2';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {Resources}              from '../util/resources.es6.js';


@Component({
	selector: 'publication-badge',
	inputs:   ['modelId', 'highlight'],
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
})
export class PublicationBadge extends ModelRepresentation {

	static endpoint = 'publications';

	select   = new EventEmitter;
	dragging = new EventEmitter;

	constructor(@Inject(DragDropService) dd, @Inject(Resources) resources) {
		super({resources});
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}

}
