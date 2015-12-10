import {NgIf, NgFor, Component, EventEmitter, Inject} from 'angular2/angular2';
import $       from 'jquery';
import scrollbarSize from 'scrollbar-size';

import {LyphTemplateView} from './lyph-template-view.es6.js';

import {Resources, request}           from '../util/resources.es6.js';
import {DeleteTarget}                  from '../util/delete-target.es6.js';
import {FieldSubstringPipe}            from '../util/substring-pipe.es6.js';
import {GlyphIcon}                     from '../util/glyph-icon.es6.js';


@Component({
	selector: 'lyph-template-list',
	events: ['select', 'add'],
	directives: [
		NgFor,
		LyphTemplateView,
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
			        placeholder = "Filter Lyph Templates"
					(input)     = "filter = $event.target.value"
					(paste)     = "filter = $event.target.value">
				</input>
				<glyph-icon glyph="filter" class="form-control-feedback" color="gray"></glyph-icon>
			</div>

			<div style="visibility: hidden; height: 34px"></div>

			<lyph-template-view
				*ng-for     = " #model of allResources['lyphTemplates'] | fieldSubstring:filterText:filter "
				 class      = " list-group-item                                     "
				[model-id]  = " model.id                                            "
				[highlight] = " filter                                              "
				(select)    = " select.next($event)                                 "
				(dragging)  = " showTrashcan = !!$event                             ">
	        </lyph-template-view>

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
export class LyphTemplateList {

	select = new EventEmitter;
	add    = new EventEmitter;

	constructor(@Inject(Resources) resources) {
		this.resources = resources;
		this.allResources = resources.getAllResources_sync();
		this.models = resources.getAllResources_sync()['lyphTemplates'];
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

	filterText(model) { return model.name }

}
