import {Component, EventEmitter, Inject} from 'angular2/core';
import scrollbarSize from 'scrollbar-size';

import {Resources, request}           from '../util/resources.es6.js';
import {DeleteTarget}                  from '../util/delete-target.es6.js';
import {FieldSubstringPipe}            from '../util/substring-pipe.es6.js';
import {GlyphIcon}                     from '../util/glyph-icon.es6.js';

import {PublicationView} from './publication-view.es6.js';


@Component({
	selector: 'publication-list',
	events: ['select', 'add'],
	directives: [
		PublicationView,
		DeleteTarget,
		GlyphIcon
	], pipes: [
		FieldSubstringPipe
	], template: `

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
			        placeholder = "Filter Publications"
					(input)     = "filter = $event.target.value"
					(paste)     = "filter = $event.target.value">
				<glyph-icon glyph="filter" class="form-control-feedback" color="gray"></glyph-icon>
			</div>

			<div style="visibility: hidden; height: 34px"></div>

			<publication-view
				*ngFor     = " #model of allResources['publications'] | fieldSubstring:filterText:filter "
				 class      = " list-group-item                                     "
				[modelId]  = " model.id                                            "
				[highlight] = " filter                                              "
				(select)    = " select.next($event)                                 "
				(dragging)  = " showTrashcan = !!$event                             ">
	        </publication-view>

			<div style="visibility: hidden; height: 34px"></div>

			<button type="button" class="btn btn-default"
			        style="position: absolute; bottom: -1px; left: 1px; border-radius: 0;"
			        [style.width] = " 'calc(100% - '+scrollbarSize+'px)' "
			        (click)       = " add.next() ">
				<span class="glyphicon glyphicon-plus"></span> Add new Lyph Template
			</button>
		</div>

	`,
	styles: [``]
})
export class PublicationList {

	select = new EventEmitter;
	add    = new EventEmitter;

	constructor(resources: Resources) {
		this.resources = resources;
		this.allResources = resources.getAllResources_sync();
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
