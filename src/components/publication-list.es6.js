import {NgIf, NgFor, Component, EventEmitter, Inject} from 'angular2/angular2';
import scrollbarSize from 'scrollbar-size';

import {getAllResources_sync, request} from '../util/resources.es6.js';
import {DeleteTarget}                  from '../util/delete-target.es6.js';
import {FieldSubstringPipe}            from '../util/substring-pipe.es6.js';
import {GlyphIcon}                     from '../util/glyph-icon.es6.js';

import {PublicationView} from './publication-view.es6.js';


@Component({
	selector: 'publication-list',
	events: ['select'],
	directives: [
		NgFor,
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
				</input>
				<glyph-icon glyph="filter" class="form-control-feedback" color="gray"></glyph-icon>
			</div>

			<div style="visibility: hidden; height: 34px"></div>

			<publication-view
				*ng-for     = " #model of models | fieldSubstring:filterText:filter "
				 class      = " list-group-item                                     "
				[model-id]  = " model.id                                            "
				[highlight] = " filter                                              "
				(select)    = " select.next($event)                                 "
				(dragging)  = " showTrashcan = !!$event                             ">
	        </publication-view>
		</div>

	`,
	styles: [``]
})
export class PublicationList {

	select = new EventEmitter;

	constructor() {
		this.models = getAllResources_sync('publications');
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
	}

	async deleteResource(model) {
		try {
			await request.delete(`/publications/${model.id}`);
			this.models = this.models.filter(({id}) => id !== model.id);
		} catch (err) {
			console.dir(err); // TODO: create human readable message for this
		}
	}

	filterText(model) { return model.title }

}
