import ng from 'angular2/angular2';
import scrollbarSize from 'scrollbar-size';

import {ClinicalIndexView} from './clinical-index-view.es6.js';

import {getAllResources_sync} from '../util/resources.es6.js';
import {DeleteTarget}         from '../util/delete-target.es6.js';
import {FieldSubstringPipe}   from '../util/substring-pipe.es6.js';

export const ClinicalIndexList = ng.Component({
	selector: 'clinical-index-list',
	events: ['select']
}).View({directives: [
	ng.NgFor,
	ClinicalIndexView,
	DeleteTarget
], pipes: [
	FieldSubstringPipe
], template: `

	<delete-target (catch)       = " deleteResource($event)                 "
	               [show]        = " showTrashcan                           "
	               [style.width] = " 'calc(100% - '+(scrollbarSize+2)+'px)' "
	               style         = " z-index: 10; left: 2px;                "></delete-target>
	<div class="list-group" style="margin: 0">
		<div  class        = "form-group has-feedback"
              style        = "padding: 0; margin: 0; position: absolute; left: 1px; z-index: 9;"
             [style.width] = "'calc(100% - '+scrollbarSize+'px)'">
			<input type        = "text"
			       class       = "form-control"
		           placeholder = "Filter"
			       style       = "border-radius: 0"
			       (input)     = "filter = $event.target.value"
			       (paste)     = "filter = $event.target.value">
			<span class="glyphicon glyphicon-filter form-control-feedback" style="color: gray"></span>
		</div>

		<div style="visibility: hidden; height: 34px"></div>

		<button *ng-for          = "#model of models | fieldSubstring:filterText:filter"
		         class           = "list-group-item"
		         style           = "padding: 10px"
		        [clinical-index] = "model"
		        [highlight]      = "filter"
		        (select)         = "select.next($event)"
		        (dragging)       = "showTrashcan = !!$event">
        </button>
	</div>

`, styles: [``]}).Class({

	constructor() {
		this.models = getAllResources_sync('clinicalIndices');
		this.select = new ng.EventEmitter();
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
	},

	deleteResource(resource) {
		console.log('TODO: delete', resource);
	},

	filterText(model) { return model.title }

});
