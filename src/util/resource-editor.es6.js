import {NgSwitch, FORM_DIRECTIVES, Component, EventEmitter, Inject} from 'angular2/angular2';
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

import {DragDropService}           from '../util/drag-drop-service.es6.js';
import {Resources}           from '../util/resources.es6.js';
import {UnderlineSubstringPipe}    from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}            from '../util/escape-html-pipe.es6.js';
import {DeleteTarget}              from '../util/delete-target.es6.js';
import {sw}                        from '../util/misc.es6.js';



const META_PROPERTIES = ['id', 'key'];



@Component({
	selector: 'resource-editor',
	inputs:   ['model'],
	events:   ['submit', 'reset', 'close'],
	host: {},
	pipes: [
		UnderlineSubstringPipe, // These need to be here because of a bug in angular2:
		EscapeHtmlPipe          // https://github.com/angular/angular/issues/5388
	],
	directives: [
		NgSwitch,
		FORM_DIRECTIVES,
		LyphTemplateBadge,
		PublicationBadge,
		ClinicalIndexBadge,
		LocatedMeasureBadge,
		DeleteTarget
	],
	template: `

		<form *ng-if="model" #form="form" (submit)="submit.next(form.value)">

			<header  class        = " navbar navbar-default                "
				    [style.width] = " 'calc(100% - '+(scrollbarSize)+'px)' ">
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
							<button type="button" title="Discard Changes" (click)="reset.next()" [disabled]="isPristine()">
								<span class="glyphicon glyphicon-refresh"></span>
					        </button>
						</li>
						<li>
							<button type="button" title="Cancel" (click)="close.next()">
								<span class="glyphicon glyphicon-remove"></span>
					        </button>
						</li>
						<li>
							<button type="submit" title="Save Changes" [disabled]="isPristine()">
								<span class="glyphicon glyphicon-ok"></span>
					        </button>
						</li>
					</ul>
				</div>
			</header>
			<delete-target
				[style.width] = " 'calc(100% - '+(scrollbarSize+2)+'px)' "
				[show]        = " showTrashcan                           "
				(catch)       = " removeBadge($event)                    ">
			</delete-target>

			<div style="visibility: hidden; height: 50px"></div>

			<div class="control-container" [ng-switch]="model.type">
				<template ng-switch-when="ClinicalIndex" >${clinicalIndexEditor} </template>
				<template ng-switch-when="Publication"   >${publicationEditor}   </template>
				<template ng-switch-when="LyphTemplate"  >${lyphTemplateEditor}  </template>
				<template ng-switch-when="LocatedMeasure">${locatedMeasureEditor}</template>
				<template ng-switch-when="Correlation"   >${correlationEditor}   </template>
			</div>

		</form>

	`,
	styles: [`

		:host header {
			position: absolute;
			left:     1px;
			top:      1px;
			z-index: 9;
			margin: 0;
			border: 1px solid lightgray;
			border-radius: 0;
		}

		:host delete-target {
			z-index: 10;
			left: 2px;
			top: 50px;
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

		:host header button          { color: #777                  }
		:host header button:hover    { color: #000                  }
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
})
export class ResourceEditor {

	/* events */
	submit = new EventEmitter;
	reset  = new EventEmitter;
	close  = new EventEmitter;

	/* local variables */
	showTrashcan  = false;
	scrollbarSize = scrollbarSize();


	constructor(@Inject(DragDropService) dd, @Inject(Resources) resources) {
		this.resources = resources;

		/* drag/drop recipient for correlation editor */
		this.ddc = dd.recipient(this, {
			acceptedTypes: ['Publication', 'ClinicalIndex', 'LocatedMeasure'],
			dropEffect: 'link',
			dragover:  false,
			dragenter: false, // TODO: react to these for visual hints
			dragleave: false, //
			drop({id, type}) {
				switch (type) {
					case 'Publication': {
						this.resource.publication = id;
					} break;
					case 'ClinicalIndex': {
						this.resource.clinicalIndices = [...new Set([...(this.resource.clinicalIndices || []), id])];
					} break;
					case 'LocatedMeasure': {
						this.resource.locatedMeasures = [...new Set([...(this.resource.locatedMeasures || []), id])];
					} break;
				}
				return false;
			}
		});

		/* drag/drop recipient for located measure editor */
		this.ddlm = dd.recipient(this, {
			acceptedTypes: ['LyphTemplate'],
			dropEffect: 'link',
			dragover:  false,
			dragenter: false, // TODO: react to these for visual hints
			dragleave: false, //
			drop({id}) {
				this.resource.lyphTemplate = id;
				return false;
			}
		});

		/* react to button clicks */
		this.reset.subscribe(() => {
			this.resource = { ...this.model };
			for (let key of META_PROPERTIES) { delete this.resource[key] }
		});
		this.submit.subscribe(() => {
			this.persistChanges();
		});
	}

	isPristine() {
		let allKeys = new Set([...Object.keys(this.model), ...Object.keys(this.resource)]);
		for (let key of allKeys) {
			let a = this.model   [key];
			let b = this.resource[key];
			if (!META_PROPERTIES.includes(key) && a !== b) {
				if (!Array.isArray(a))               { return false }
				if (a.length !== b.length)           { return false }
				for (let v of a) if (!b.includes(v)) { return false }
			}
		}
		return true;
	}

	onChanges({model}) {
		if (model) {
			this.resource = { ...model.currentValue };
			for (let key of META_PROPERTIES) { delete this.resource[key] }
		}
	}

	removeBadge(model) {
		switch (model.type) {
			case 'Publication':    {
				this.resource.publication = null;
			} break;
			case 'ClinicalIndex':  {
				let s = new Set(this.resource.clinicalIndices || []);
				s.delete(model.id);
				this.resource.clinicalIndices = [...s];
			} break;
			case 'LocatedMeasure': {
				let s = new Set(this.resource.locatedMeasures || []);
				s.delete(model.id);
				this.resource.locatedMeasures = [...s];
			} break;
			case 'LyphTemplate': {
				this.resource.lyphTemplate = null;
			} break;
		}
		this.showTrashcan = false;
	}

	async persistChanges() {

		/* make sure we don't send silly things */
		for (let key of META_PROPERTIES) { delete this.resource[key] }

		///* determine REST endpoint */
		//let endpoint = sw(this.model.type)({
		//	'Publication':    'publications',
		//	'ClinicalIndex':  'clinicalIndices',
		//	'LocatedMeasure': 'locatedMeasures',
		//	'LyphTemplate':   'lyphTemplates',
		//	'Correlation':    'correlations'
		//});

		if (this.model.id) {

			/* persist to the server */
			let newModel = await this.resources.updateResource(this.model.id, this.resource);

			/* persist to the local model */
			Object.assign(this.model, newModel);

		} else {

			/* persist to the server */
			let newModel = await this.resources.addNewResource(this.resource);

			/* persist to the local model */
			Object.assign(this.model,    newModel);
			Object.assign(this.resource, newModel);

		}

	}


}
