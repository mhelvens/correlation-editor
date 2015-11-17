import ng      from 'angular2/angular2';
import $       from 'jquery';
import scrollbarSize from 'scrollbar-size';

import {LocatedMeasureView} from './located-measure-view.es6.js';

import {getAllResources_sync, getResource_sync} from '../util/resources.es6.js';
import {DeleteTarget}                           from '../util/delete-target.es6.js';
import {FieldSubstringPipe}                     from '../util/substring-pipe.es6.js';

export const LocatedMeasureList = ng.Component({
	selector: 'located-measure-list',
	events: ['select']
}).View({directives: [
	ng.NgFor,
	LocatedMeasureView,
	DeleteTarget
], pipes: [
	FieldSubstringPipe
], template: `

	<delete-target (catch)       = " deleteResource($event)                 "
	               [show]        = " showTrashcan                           "
	               [style.width] = " 'calc(100% - '+(scrollbarSize+2)+'px)' "
	               style         = " z-index: 10; left: 2px;                "></delete-target>
	<div class="list-group" style="margin: 0">
        <div  class        = "input-group"
              style        = "padding: 0; position: absolute; left: 1px"
             [style.width] = "'calc(100% - '+(scrollbarSize-1)+'px)'">
			<div class="form-group has-feedback">
				<input type        = "text"
				       class       = "form-control"
			           placeholder = "Filter"
			           style       = "border-radius: 0"
				       (input)     = "filter = $event.target.value"
				       (paste)     = "filter = $event.target.value">
				<span class="glyphicon glyphicon-filter form-control-feedback" style="color: gray"></span>
			</div>
			<span class="input-group-btn" data-toggle="buttons">
				<label class="btn btn-default" [class.active]="filterFlags.byLyphTemplate" style="height: 34px; border-radius: 0;" title="Filter by Lyph Template">
					<input name="byLyphTemplate" type="checkbox" data-toggle="button" [checked]="filterFlags.byLyphTemplate">
					<span class="icon icon-artery icon-in-button"></span>
				</label>
			</span>
		</div>

		<div style="visibility: hidden; height: 34px"></div>

		<button *ng-for           = "#model of models | fieldSubstring : filterText : filter : filterFlags"
		         class            = "list-group-item"
		         style            = "padding: 10px"
		        [located-measure] = "model"
		        [highlight]       = "filter"
		        (select)          = "select.next($event)"
		        (dragging)        = "showTrashcan = !!$event">
        </button>
	</div>

`, styles: [``]}).Class({

	constructor: [ng.ChangeDetectorRef, function (ref) {
		this.models = getAllResources_sync('locatedMeasures');
		this.filterFlags = {
			byLyphTemplate: true
		};
		// Can't get [(ng-model)] to work for checkboxes that look like buttons.
		// So we're using jquery change detection and have to manually trigger change detection.
		$(`[name="byLyphTemplate"]`).change(({target:{checked}}) => {
			this.filterFlags = { ...this.filterFlags, byLyphTemplate: checked };
			ref.detectChanges();
		});
		this.select = new ng.EventEmitter();
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
	}],

	deleteResource(resource) {
		console.log('TODO: delete', resource);
	},

	filterText(model, flags) {
		return [
			(model.quality),
			(flags.byLyphTemplate ? getResource_sync('lyphTemplates', model.lyphTemplate).name : "")
		].join(' of ');
	}

});
