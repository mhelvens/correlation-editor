import {Component, EventEmitter, forwardRef} from 'angular2/core';

import scrollbarSize from 'scrollbar-size';

import {ClinicalIndexView}      from '../components/clinical-index-view.es6.js';
import {ModelRepresentation}    from '../util/model-representation.es6.js';
import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {FieldSubstringPipe}     from '../util/substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';
import {FilterPipe}             from '../util/filter-pipe.es6.js';
import {MapPipe}                from '../util/map-pipe.es6.js';
import {Resources, request}     from '../util/resources.es6.js';
import {DeleteTarget}           from '../util/delete-target.es6.js';

const INDENT = 16;

@Component({
	selector: 'clinical-index-hierarchical-list',
	directives: [
		ClinicalIndexView,
		DeleteTarget,
		forwardRef(() => ClinicalIndexHierarchicalList)
	],
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe,
		FieldSubstringPipe,
		FilterPipe,
		MapPipe
	],
	inputs: ['modelId', 'highlight', 'parentId'],
	events: ['choose', 'add', 'dragging'],
	host: {
		...DragDropService.acceptsDrop('ddr')
	},
	template: `

		<template [ngIf]="modelId">
			<div *ngIf="parentId || model.parents.length === 0" class="subtree-container">
				<div *ngIf   = " model.parents.length > 0  "
				      class  = " unlink-from-parent-button "
				     (click) = " unlinkFromParent()        ">
					<span class="glyphicon glyphicon-remove"></span>
				</div>
				<clinical-index-view
					 style          = " margin-bottom: -1px                    "
				    [modelId]       = " modelId                                "
				    [highlight]     = " highlight                              "
				    [style.opacity] = " explicitlyHighlighted(model) ? 1 : 0.4 "
				    (dragging)      = " dragging.next($event)                  "
				    (choose)        = " choose  .next($event)                  ">
				</clinical-index-view>
				<div *ngIf   = " model.children.length > 0    "
				      class  = " plus-minus-button            "
				     (click) = " hideChildren = !hideChildren ">
					<span>{{ hideChildren ? '+' : '−' }}</span>
				</div>
				<div *ngIf="!hideChildren" [style.margin-left.px]=" ${INDENT} ">
					<div *ngIf="draggingToInsert" class="insert-point"></div>
					<clinical-index-hierarchical-list
						*ngFor      = " #child of model.children | map:resolveModel | filter:highlighted:highlight "
						[parentId]  = " model.id                   "
						[modelId]   = " child.id                   "
				        [highlight] = " highlight                  "
						(dragging)  = " dragging.next($event)      "
						(choose)    = " choose  .next($event)      ">
					</clinical-index-hierarchical-list>
				</div>
			</div>
		</template>

		<template [ngIf]="!modelId">

			<delete-target
				 style        = " z-index: 10; left: 2px;                "
				[style.width] = " 'calc(100% - '+(scrollbarSize+2)+'px)' "
				[show]        = " showTrashcan                           "
				(catch)       = " deleteResource($event)                 ">
			</delete-target>
			<div class="list-group" style="margin: 0">
				<div class        = "form-group has-feedback"
		             style        = "padding: 0; margin: 0; position: absolute; left: 1px; z-index: 9;"
		            [style.width] = "'calc(100% - '+scrollbarSize+'px)'">
					<input
						type        = "text"
						class       = "form-control"
						style       = "border-radius: 0"
				        placeholder = "Filter Clinical Indices"
						(input)     = "highlight = $event.target.value"
						(paste)     = "highlight = $event.target.value">
					<span class="form-control-feedback" style="font-size: 10px; color: gray; width: auto; margin-right: 8px;">{{(allResources['clinicalIndices'] | fieldSubstring:filterText:highlight).length}} / {{allResources['clinicalIndices'].length}}</span>
				</div>

				<div style="visibility: hidden; height: 34px"></div>

				<clinical-index-hierarchical-list
					*ngFor      = " #model of allResources['clinicalIndices'] | filter:highlighted:highlight "
					[modelId]   = " model.id                "
			        [highlight] = " highlight               "
			        (choose)    = " choose.next($event)     "
			        (dragging)  = " showTrashcan = !!$event ">
				</clinical-index-hierarchical-list>

				<div style="visibility: hidden; height: 34px"></div>

				<button type="button" class="btn btn-default"
				        style="position: absolute; bottom: -1px; left: 1px; border-radius: 0;"
				        [style.width] = " 'calc(100% - '+scrollbarSize+'px)' "
				        (click)       = " add.next()                         ">
					<span class="glyphicon glyphicon-plus"></span> Add new Clinical Index
				</button>
			</div>

		</template>

	`,
	styles: [`

		.subtree-container {
			position: relative;
		}

		:host:not(:hover) .unlink-from-parent-button,
		:host:not(:hover) .plus-minus-button {
			display: none !important;
		}

		.unlink-from-parent-button {
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10;
			position: absolute;
			top: 0;
			left: 0;

			padding: 0;
			width: 13px;
			height: 13px;
			border: solid 1px #999999;
			background-color: white;

			cursor: pointer;
		}

		.unlink-from-parent-button > span {
			display: block;
			text-align: center;
			font-size: 9px;
			position: relative;
			top: 0;
			left: 0;
		}

		.plus-minus-button {
			display: flex;
			align-items: center;
			justify-content: center;

			margin: -14px 0 0 1px;
			padding: 0;
			width: 13px;
			height: 13px;
			position: relative;
			top:   1px;
			left: -1px;
			border: solid 1px #999999;
			background-color: white;

			cursor: pointer;
		}

		.plus-minus-button > span {
			display: block;
			text-align: center;
			font-size: 14px;
			line-height: 14px;
			position: relative;
			top: -1px;
		}

		.insert-point {
			margin: 4px 0 3px;
			padding: 0;
			border-top: dashed 2px #999999;
		}

	`]
})
export class ClinicalIndexHierarchicalList extends ModelRepresentation {

	static endpoint = 'clinicalIndices';

	choose   = new EventEmitter;
	add      = new EventEmitter;
	dragging = new EventEmitter;

	constructor(dd: DragDropService, resources: Resources) {
		super({resources});
		this.allResources = resources.getAllResources_sync();
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
		this.resolveModel = this.resolveModel.bind(this);
		this.highlighted = this.highlighted.bind(this);
		this.explicitlyHighlighted = this.explicitlyHighlighted.bind(this);
		this.ddr = dd.recipient(this, {
			acceptedTypes: ['clinicalindex'],
			dropEffect: 'link',
			dragover: false,
			dragenter() { this.draggingToInsert = true;  return false; },
			dragleave() { this.draggingToInsert = false; return false; },
			drop(resource) {
				(async () => {
					try {
						/* check for cycle */
						const pathExists = (from, to) => {
							if (from === to) { return true }
							for (let fromChildId of from.children) {
								let fromChild = this.resources.getResource_sync('clinicalIndices', fromChildId);
								if (pathExists(fromChild, to)) { return true }
							}
							return false;
						};
						if (pathExists(resource, this.model)) {
							console.log(`Making ${resource.id} a child of ${this.model.id} would create a cycle.`);
							return;
						}

						/* create the new link */
						await request.put(`/clinicalIndices/${this.model.id}/children/${resource.id}`);
						this.model.children = [...new Set([...this.model.children, resource.id  ])];
						resource.parents    = [...new Set([...resource.parents,    this.model.id])];
					} catch (err) {
						console.error(err);
					} finally {
						this.draggingToInsert = false;
					}
				})();
				return false;
			}
		});
	}

	filterText(model) { return model.title }

	resolveModel(modelId) { return this.resources.getResource_sync('clinicalIndices', modelId) }

	noParents(model) { return !model.parents || model.parents.length === 0 }

	highlighted(model, highlight) {
		if (this.explicitlyHighlighted(model)) { return true }
		for (let childId of model.children) {
			let child = this.resources.getResource_sync('clinicalIndices', childId);
			if (this.highlighted(child)) { return true }
		}
		return false;
	}

	explicitlyHighlighted(model, highlight) {
		return (model.title || "").toLowerCase().includes((this.highlight || "").trim().toLowerCase());
	}

	unlinkFromParent() {
		(async () => {
			try {
				let parent = this.resources.getResource_sync('clinicalIndices', this.parentId);
				await request.delete(`/clinicalIndices/${this.model.id}/parents/${parent.id}`);
				let s;
				s = new Set(this.model.parents);
				s.delete(parent.id);
				this.model.parents = [...s];
				s = new Set(parent.children);
				s.delete(this.model.id);
				parent.children = [...s];
			} catch (err) {
				console.error(err);
			}
		})();
	}

}
