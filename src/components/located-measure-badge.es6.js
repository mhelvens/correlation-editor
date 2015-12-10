import {Component, EventEmitter, Inject} from 'angular2/angular2';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js';
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {Resources}           from '../util/resources.es6.js';

@Component({
	selector: 'located-measure-badge',
	inputs:   ['modelId', 'highlight'],
	events:   ['select', 'dragging'],
	host: {
		'[class.resource-badge]':  `  true                                             `,
		'[title]':                 ` model.quality + ' of ' + lyphTemplateModel().name `,
		'(click)':                 ` select.next(model); $event.stopPropagation();     `,
		...DragDropService.canBeDragged('dds')
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
})
export class LocatedMeasureBadge extends ModelRepresentation {

	static endpoint = 'locatedMeasures';

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

	lyphTemplateModel() {
		return this.resources.getResource_sync('lyphTemplates', this.model.lyphTemplate);
	}

}
