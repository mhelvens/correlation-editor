import {Component, EventEmitter} from 'angular2/core';

import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js';
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {Resources}              from '../util/resources.es6.js';

@Component({
	selector: 'located-measure-badge',
	inputs:   ['modelId', 'highlight'],
	events:   ['choose', 'dragging'],
	host: {
		'[class.resource-badge]':  `  true                                             `,
		'[title]':                 ` model.quality + ' of ' + lyphTemplateModel().name `,
		'(click)':                 ` choose.next({event: $event, model: model}); $event.stopPropagation();     `,
		...DragDropService.canBeDragged('dds')
	},
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	template: `

		<span [innerHtml]="model.quality            | escapeHTML | underlineSubstring:highlight"></span>
		<span style="font-weight: normal">of</span>
		<span [innerHtml]="lyphTemplateModel().name | escapeHTML | underlineSubstring:highlight"></span>

	`,
	styles: [`
		:host       { background-color: #efe !important }
		:host:hover { background-color: #cfc !important }
	`]
})
export class LocatedMeasureBadge extends ModelRepresentation {

	static endpoint = 'locatedMeasures';

	choose   = new EventEmitter;
	dragging = new EventEmitter;

	constructor(dd: DragDropService, resources: Resources) {
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
