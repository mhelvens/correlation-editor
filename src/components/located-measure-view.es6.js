import {NgIf, NgFor, Component, EventEmitter, Inject} from 'angular2/angular2';

import {LyphTemplateBadge} from './lyph-template-badge.es6.js';

import {ModelRepresentation}       from '../util/model-representation.es6.js';
import {DragDropService}           from '../util/drag-drop-service.es6.js';
import {UnderlineSubstringPipe}    from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}            from '../util/escape-html-pipe.es6.js';
import {Resources, request}           from '../util/resources.es6.js';


@Component({
	selector: 'located-measure-view',
	directives: [
		NgIf,
		LyphTemplateBadge
	],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	inputs: ['modelId', 'highlight'],
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
			<lyph-template-badge
				*ng-if      = " model.lyphTemplate  "
				[model-id]  = " model.lyphTemplate  "
				[highlight] = " highlight           "
				(select)    = " select.next($event) ">
			</lyph-template-badge>
		</div>

	`,
	styles: [`

		:host       { background-color: #efe !important }
		:host:hover { background-color: #cfc !important }

	`]
})
export class LocatedMeasureView extends ModelRepresentation {

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
	}

	onInit() {
		this.lyphTemplateModel = this.resources.getResource_sync('lyphTemplates', this.model.lyphTemplate);
	}

}
