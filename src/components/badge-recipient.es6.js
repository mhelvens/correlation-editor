import ng      from 'angular2/angular2';

import {LyphTemplateBadge} from './lyph-template-badge.es6.js';

import {DragDropService}        from '../util/drag-drop-service.es6.js';
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {getResource_sync}       from '../util/resources.es6.js';


export const LocatedMeasureView = ng.Component({
	selector: 'located-measure-view',
	directives: [
		ng.NgIf,
		LyphTemplateBadge
	],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['model', 'highlight'],
	events: ['select', 'dragging'],
	host: {
		'[class.resource-view]': ` true                                            `,
		'[title]':               ` model.quality + ' of ' + lyphTemplateModel.name `,
		'(click)':               ` select.next(model)                              `,
		...DragDropService.canBeDragged('dds'),
		...DragDropService.acceptsDrop ('ddr')
	},
	template: `

		<div class="icon icon-LocatedMeasure"></div>
		<div class="text-content">
			<span [inner-html]="model.quality | escapeHTML | underlineSubstring:highlight"></span>
			<b>of</b>
			<lyph-template-badge *ng-if      = "lyphTemplateModel"
			                     [model]     = "lyphTemplateModel"
			                     [highlight] = "highlight"
			                     (select)    = "select.next($event)"
			                     (dragging)  = "dragging.next($event)">
			</lyph-template-badge>
		</div>

	`,
	styles: [`

		:host       { background-color: #efe !important }
		:host:hover { background-color: #cfc !important }

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
		this.ddr = dd.recipient(this, {
			acceptedTypes: ['lyphtemplate'],
			dropEffect: 'link',
			dragover:  false,
			dragenter: false, // TODO: react to these for visual hints
			dragleave: false, //
			drop(resource) {
				(async () => {
					try {
						await request.post(`/locatedMeasures/${this.model.id}`).send({ lyphTemplate: resource.id });
						this.model.lyphTemplate = resource.id;
						this.lyphTemplateModel  = resource;
					} catch (err) {
						console.error(err);
					}
				})();
				return false;
			}
		});
	}],

	onInit() {
		this.lyphTemplateModel = getResource_sync('lyphTemplates', this.model.lyphTemplate);
	}

});