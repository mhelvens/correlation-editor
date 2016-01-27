import {Component, EventEmitter} from 'angular2/core';

import scrollbarSize from 'scrollbar-size';

import {ClinicalIndexView} from './clinical-index-view.es6.js';

import {Resources, request} from '../util/resources.es6.js';
import {DeleteTarget}       from '../util/delete-target.es6.js';
import {FieldSubstringPipe} from '../util/substring-pipe.es6.js';
import {GlyphIcon}          from '../util/glyph-icon.es6.js';

@Component({
	selector: 'clinical-index-list',
	events: ['choose', 'add'],
	directives: [
		ClinicalIndexView,
		DeleteTarget,
		GlyphIcon
	],
	pipes: [
		FieldSubstringPipe
	],
	template: `

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
					(input)     = "filter = $event.target.value"
					(paste)     = "filter = $event.target.value">
				<span class="form-control-feedback" style="font-size: 10px; color: gray; width: auto; margin-right: 8px;">{{(allResources['clinicalIndices'] | fieldSubstring:filterText:filter).length}} / {{allResources['clinicalIndices'].length}}</span>
			</div>

			<div style="visibility: hidden; height: 34px"></div>

			<clinical-index-view
				*ngFor      = " #model of allResources['clinicalIndices'] | fieldSubstring:filterText:filter "
			     class      = " list-group-item         "
			    [modelId]   = " model.id                "
			    [highlight] = " filter                  "
			    (choose)    = " choose.next($event)     "
			    (dragging)  = " showTrashcan = !!$event ">
	        </clinical-index-view>

			<div style="visibility: hidden; height: 34px"></div>

			<button type="button" class="btn btn-default"
			        style="position: absolute; bottom: -1px; left: 1px; border-radius: 0;"
			        [style.width] = " 'calc(100% - '+scrollbarSize+'px)' "
			        (click)       = " add.next()                         ">
				<span class="glyphicon glyphicon-plus"></span> Add new Clinical Index
			</button>
		</div>

	`,
	styles: [``]
})
export class ClinicalIndexList {

	choose = new EventEmitter;
	add    = new EventEmitter;

	constructor(resources: Resources) {
		this.resources = resources;
		this.allResources = resources.getAllResources_sync();
		this.models = resources.getAllResources_sync()['clinicalIndices']; // TODO: remove line?
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
	}

	async deleteResource(model) {
		this.showTrashcan = false;
		try {
			await this.resources.deleteResource(model);
		} catch (err) {
			console.dir(err); // TODO: create human readable message for this
		}
	}

	filterText(model) { return model.title }

}
