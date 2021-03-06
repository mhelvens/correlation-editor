import {Component, EventEmitter} from 'angular2/core';

import {ModelRepresentation} from '../util/model-representation.es6.js';
import {LocatedMeasureBadge} from './located-measure-badge.es6.js';
import {PublicationBadge}    from './publication-badge.es6.js';
import {ClinicalIndexBadge}  from './clinical-index-badge.es6.js';

import {DragDropService}        from '../util/drag-drop-service.es6.js';
import {Resources, request}     from '../util/resources.es6.js';
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';

@Component({
	selector: 'correlation-view',
	events: ['choose', 'dragging'],
	inputs: ['modelId', 'highlight'],
	host: {
		'[class.panel]':         ' true     ',
		'[class.panel-default]': ' true     ',
		'[class.hovering]':      ' hovering ',
		'[style.display]':       ' "block"  ',
		...DragDropService.canBeDragged('dds'),
		...DragDropService.acceptsDrop ('ddr')
	},
	directives: [
		PublicationBadge,
		ClinicalIndexBadge,
		LocatedMeasureBadge
	],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	template: `

		<div class="panel-heading" [class.no-comment]="!model.comment">
			<h4 class="panel-title" style="font-weight: bold; display: flex; align-content: center; align-items: center;">
				<div (click)="choose.next({event: $event, model: model})" (mouseover)="hovering = true" (mouseout)="hovering = false" style="flex-grow: 1">
					<span class="icon icon-Correlation" style="margin-right: 0"></span>&nbsp;
					Correlation
					(<span class="text-content" [innerHtml]="model.id.toString() | escapeHTML | underlineSubstring:highlight"></span>)
				</div>
				<a data-toggle="collapse" href="#collapse-{{ model.id }}" class="collapsed" style="display: block; text-decoration: none; cursor: pointer; flex-grow: 0">
					<span *ngIf="model.comment" class="comment-indicator">
						comment
						<span class="glyphicon glyphicon-chevron-right"></span>
						<span class="glyphicon glyphicon-chevron-down"></span>
					</span>
				</a>
			</h4>
		</div>
		<div *ngIf="model.comment" id="collapse-{{ model.id }}" class="panel-collapse collapse">
			<div class="panel-body" [innerHtml]="model.comment | escapeHTML | underlineSubstring:highlight"></div>
		</div>
		<div class="panel-footer" [class.no-comment]="!model.comment">
			<publication-badge
				*ngIf       = " model.publication     "
				[modelId]   = " model.publication     "
				[highlight] = " highlight             "
				(choose)    = " choose.next($event)   "
				(dragging)  = " dragging.next($event) ">
			</publication-badge><!--
			--><clinical-index-badge
				*ngFor      = " #id of model.clinicalIndices "
				[modelId]   = " id                           "
				[highlight] = " highlight                    "
				(choose)    = " choose.next($event)          "
				(dragging)  = " dragging.next($event)        ">
			</clinical-index-badge><!--
			--><located-measure-badge
				*ngFor      = " #id of model.locatedMeasures "
				[modelId]   = " id                           "
				[highlight] = " highlight                    "
				(choose)    = " choose.next($event)          "
				(dragging)  = " dragging.next($event)        ">
			</located-measure-badge>
		</div>

	`,
	styles: [`

		.panel-heading            { border: solid 1px #444;                   }
		.panel-heading.no-comment { border-bottom-style: none;                }
		.panel-footer             { border: solid 1px #444;                   }
		.panel-footer.no-comment  { border-top-style: none; margin-top: -5px; }

		.panel-heading {
			padding: 10px !important;
			cursor: pointer;
		}

		.panel-heading.no-comment a {
			cursor: default;
		}

		.panel-heading a .comment-indicator {
		    color: grey;
		}

		.panel-heading a .comment-indicator .glyphicon {
		    margin-left: 3px
		}

		.panel-heading a.collapsed       .glyphicon-chevron-down  { display: none }
		.panel-heading a:not(.collapsed) .glyphicon-chevron-right { display: none }

		.resource-badge {
			margin: 0 5px 5px 0;
		}
		.panel-footer {
			padding: 10px 10px 5px 10px !important;
		}

		:host          .panel-heading, :host          .panel-footer { background-color: #eee !important }
		:host.hovering .panel-heading, :host.hovering .panel-footer { background-color: #ddd !important }

	`]
})
export class CorrelationView extends ModelRepresentation {

	static endpoint = 'correlations';

	choose   = new EventEmitter;
	dragging = new EventEmitter;

	hovering = false;

	constructor(dd: DragDropService, resources: Resources) {
		super({resources});
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
		this.ddr = dd.recipient(this, {
			acceptedTypes: ['Publication', 'ClinicalIndex', 'LocatedMeasure'],
			dropEffect: 'link',
			dragover:  false,
			dragenter: false, // TODO: react to these for visual hints
			dragleave: false, //
			drop(resource) {
				let {id, type} = resource;
				(async () => {
					try {
						switch (type) {
							case 'Publication': {
								await request.post(`/correlations/${this.model.id}`).send({ publication: id });
								this.model.publication = id;
								this.publicationModel = this.resources.getResource_sync('publications', id); // TODO: get directly from 'drop' argument
							} break;
							case 'ClinicalIndex': {
								await request.put(`/correlations/${this.model.id}/clinicalIndices/${id}`);
								this.model.clinicalIndices = [...new Set([...this.model.clinicalIndices, id])];
								this.clinicalIndexModels = this.resources.getResource_sync('clinicalIndices', this.model.clinicalIndices); // TODO: get directly from 'drop' argument
							} break;
							case 'LocatedMeasure': {
								await request.put(`/correlations/${this.model.id}/locatedMeasures/${id}`);
								this.model.locatedMeasures = [...new Set([...this.model.locatedMeasures, id])];
								this.locatedMeasureModels = this.resources.getResource_sync('locatedMeasures', this.model.locatedMeasures); // TODO: get directly from 'drop' argument
							} break;
						}
					} catch (err) {
						console.error(err);
					}
				})();
				return false;
			}
		});
	}

	ngOnInit() {
		this.publicationModel     = this.resources.getResource_sync('publications',    this.model.publication    );
		this.clinicalIndexModels  = this.resources.getResource_sync('clinicalIndices', this.model.clinicalIndices);
		this.locatedMeasureModels = this.resources.getResource_sync('locatedMeasures', this.model.locatedMeasures);
	}

}
