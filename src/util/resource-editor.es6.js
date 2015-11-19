import ng            from 'angular2/angular2';
import scrollbarSize from 'scrollbar-size';

import {clinicalIndexEditor}  from '../components/clinical-index-editor.es6.js';
import {publicationEditor}    from '../components/publication-editor.es6.js';
import {locatedMeasureEditor} from '../components/located-measure-editor.es6.js';
import {lyphTemplateEditor}   from '../components/lyph-template-editor.es6.js';
import {correlationEditor}    from '../components/correlation-editor.es6.js';
import {LocatedMeasureBadge}  from '../components/located-measure-badge.es6.js';
import {PublicationBadge}     from '../components/publication-badge.es6.js';
import {ClinicalIndexBadge}   from '../components/clinical-index-badge.es6.js';
import {LyphTemplateBadge}    from '../components/lyph-template-badge.es6.js';

import {DragDropService}        from '../util/drag-drop-service.es6.js';
import {getResource_sync}       from '../util/resources.es6.js';
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {DeleteTarget}           from '../util/delete-target.es6.js';


export const ResourceEditor = ng.Component({
	selector: 'resource-editor',
	inputs:   ['model'],
	events:   ['submit', 'reset', 'cancel'],
	host: {},
	pipes: [
		ng.JsonPipe,
		UnderlineSubstringPipe, // TODO: why do I need to include these two here? They're already in the badge components
		EscapeHtmlPipe
	],
	directives: [
		ng.NgSwitch,
		ng.FORM_DIRECTIVES,
		LyphTemplateBadge,
		PublicationBadge,
		ClinicalIndexBadge,
		LocatedMeasureBadge,
		DeleteTarget
	],
	template: `

		<div *ng-if="!model" class="placeholder">
			click on a resource to edit it
		</div>

		<form *ng-if="model" #form="form" (submit)="submit.next(form.value)">

			<header  class        = " navbar navbar-default                              "
				     style        = " position: absolute; z-index: 9; left: 1px; top: 1px; border: 1px solid lightgray; border-radius: 0"
				    [style.width] = " 'calc(100% - '+(scrollbarSize)+'px)'             ">
				<div class="container-fluid">
	                <div class="navbar-header">
						<div class="navbar-brand">
							<span class="icon icon-{{model.type}} icon-medium" style="margin-right: 0"></span>
						</div>
						<div class="navbar-brand">
							{{model.type}}
						</div>
					</div>
					<ul class="nav navbar-nav navbar-right">
						<li>
							<button type="button" (click)="reset.next()" [disabled]="!hasChanges()">
								<span class="glyphicon glyphicon-refresh"></span>
					        </button>
						</li>
						<li>
							<button type="button" (click)="cancel.next()">
								<span class="glyphicon glyphicon-remove"></span>
					        </button>
						</li>
						<li>
							<button type="submit" [disabled]="!hasChanges()">
								<span class="glyphicon glyphicon-ok"></span>
					        </button>
						</li>
					</ul>
				</div>
			</header>
			<delete-target
				 style        = " z-index: 10; left: 2px; top: 50px;     "
				[style.width] = " 'calc(100% - '+(scrollbarSize+2)+'px)' "
				[show]        = " showTrashcan                           "
				(catch)       = " removeBadge($event)                    ">
			</delete-target>

			<div style="visibility: hidden; height: 50px"></div>

			<div class="control-container" [ng-switch]="model.type">

				<template ng-switch-when="ClinicalIndex">
					${clinicalIndexEditor}
				</template>

				<template ng-switch-when="Publication">
					${publicationEditor}
				</template>

				<template ng-switch-when="LyphTemplate">
					${lyphTemplateEditor}
				</template>

				<template ng-switch-when="LocatedMeasure">
					${locatedMeasureEditor}
				</template>

				<template ng-switch-when="Correlation">
					${correlationEditor}
				</template>

			</div>

		</form>



	`,
	styles: [`

		:host header {
			margin: 0;
		}

		:host header button {
			border: none;
			background: none;
			line-height: 20px;
			position: relative;
			display: block;
			padding: 15px;
			cursor: pointer;
		}

		:host header button          { color: #777 }
		:host header button:hover    { color: #000 }
		:host header button:disabled { color: #bbb; cursor: default }

		:host .placeholder {
			display:         flex;
			justify-content: center;
			align-items:     center;
			font-weight:     bold;
			height:          100%;
		}

		:host .control-container {
			margin: 15px;
		}

		:host .control-container input[type=text],
		:host .control-container textarea {
			margin-bottom: 15px;
		}

		:host .badge-container {
			border: dashed 1px #bbb;
			padding: 8px 12px 3px 12px;
			border-radius: 4px;
			box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);

		}

		:host .badge-container .resource-badge {
			margin: 0 5px 5px 0;
		}

		.fake-placeholder {
			display: inline-block;
			color: #ccc;
			margin-bottom: 5px;
		}

	`]
}).Class({

	constructor: [DragDropService, function (dd) {

		this.submit = new ng.EventEmitter();
		this.reset  = new ng.EventEmitter();
		this.cancel = new ng.EventEmitter();

		this.submit.subscribe(() => { this.persistModel() });
		this.reset .subscribe(() => { this.resetModelTo(this.model) });

		this.resource = {};
		this.ddc = dd.recipient(this, {
			acceptedTypes: ['Publication', 'ClinicalIndex', 'LocatedMeasure'],
			dropEffect: 'link',
			dragover:  false,
			dragenter: false, // TODO: react to these for visual hints
			dragleave: false, //
			drop(resource) {
				let {id, type} = resource;
				switch (type) {
					case 'Publication':    {
						this.resource.publication = id;
						this.publicationModel = resource;
					} break;
					case 'ClinicalIndex':  {
						this.resource.clinicalIndices = [...new Set([...this.resource.clinicalIndices, id])];
						this.clinicalIndexModels = getResource_sync('clinicalIndices', this.resource.clinicalIndices);
					} break;
					case 'LocatedMeasure': {
						this.resource.locatedMeasures = [...new Set([...this.resource.locatedMeasures, id])];
						this.locatedMeasureModels = getResource_sync('locatedMeasures', this.resource.locatedMeasures);
					} break;
				}
				return false;
			}
		});
		this.ddlm = dd.recipient(this, {
			acceptedTypes: ['LyphTemplate'],
			dropEffect: 'link',
			dragover:  false,
			dragenter: false, // TODO: react to these for visual hints
			dragleave: false, //
			drop(resource) {
				this.resource.lyphTemplate = resource.id;
				this.lyphTemplateModel = resource;
				return false;
			}
		});

		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;

	}],

	hasChanges() {
		for (let key of new Set([...Object.keys(this.model), ...Object.keys(this.resource)])) {
			if (key !== 'id' && this.model[key] !== this.resource[key]) {
				if (Array.isArray(this.model[key]) && Array.isArray(this.resource[key])) {
					let a = new Set(this.model[key]), b = new Set(this.resource[key]);
					if (a.size !== b.size) { return true }
					for (let v of a) { if (!b.has(v)) { return true } }
				} else {
					return true;
				}
			}
		}
		return false;
	},

	onChanges({model}) {
		if (model) { this.resetModelTo(model.currentValue) }
	},

	resetModelTo(model) {
		this.resource = { ...model };
		delete this.resource.id;

		delete this.publicationModel;
		delete this.clinicalIndexModels;
		delete this.locatedMeasureModels;
		delete this.lyphTemplateModel;
		if (this.resource.type === 'Correlation') {
			this.publicationModel     = getResource_sync('publications',    this.resource.publication          ) || null;
			this.clinicalIndexModels  = getResource_sync('clinicalIndices', this.resource.clinicalIndices || []) || [];
			this.locatedMeasureModels = getResource_sync('locatedMeasures', this.resource.locatedMeasures || []) || [];
		} else if (this.resource.type === 'LocatedMeasure') {
			this.lyphTemplateModel    = getResource_sync('lyphTemplates',   this.resource.lyphTemplate         ) || null;
		}
	},

	removeBadge(model) {
		switch (model.type) {
			case 'Publication':    {
				this.resource.publication = null;
				this.publicationModel = null;
			} break;
			case 'ClinicalIndex':  {
				let s = new Set([...this.resource.clinicalIndices]);
				s.delete(model.id);
				this.resource.clinicalIndices = [...s];
				this.clinicalIndexModels = getResource_sync('clinicalIndices', this.resource.clinicalIndices);
			} break;
			case 'LocatedMeasure': {
				let s = new Set([...this.resource.locatedMeasures]);
				s.delete(model.id);
				this.resource.locatedMeasures = [...s];
				this.locatedMeasureModels = getResource_sync('locatedMeasures', this.resource.locatedMeasures);
			} break;
			case 'LyphTemplate': {
				this.resource.lyphTemplate = null;
				this.lyphTemplateModel = null;
			} break;
		}
		this.showTrashcan = false;
	},

	persistModel() {
		console.log(this.model.lyphTemplate, this.resource.lyphTemplate);
		Object.assign(this.model, this.resource);
		// TODO: persist to server
	}


});
