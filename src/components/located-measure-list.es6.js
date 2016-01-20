import {Component, EventEmitter, ChangeDetectorRef} from 'angular2/core';
import $             from 'jquery';
import scrollbarSize from 'scrollbar-size';

import {LocatedMeasureView} from './located-measure-view.es6.js';

import {Resources, request}           from '../util/resources.es6.js';
import {DeleteTarget}                                    from '../util/delete-target.es6.js';
import {FieldSubstringPipe}                              from '../util/substring-pipe.es6.js';
import {GlyphIcon}                                       from '../util/glyph-icon.es6.js';


@Component({
	selector: 'located-measure-list',
	events: ['choose', 'add'],
	directives: [
		LocatedMeasureView,
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
	        <div class        = "input-group"
	             style        = "padding: 0; position: absolute; left: 1px"
	            [style.width] = "'calc(100% - '+(scrollbarSize-1)+'px)'">
				<div class="form-group has-feedback">
					<input
						type        = "text"
						class       = "form-control"
						style       = "border-radius: 0"
				        placeholder = "Filter Located Measures"
						(input)     = "filter = $event.target.value"
						(paste)     = "filter = $event.target.value">
				<span class="form-control-feedback" style="font-size: 10px; color: gray; width: auto; margin-right: 8px;">{{(allResources['locatedMeasures'] | fieldSubstring:filterText:filter:filterFlags).length}} / {{allResources['locatedMeasures'].length}}</span>
				</div>
				<span class="input-group-btn" data-toggle="buttons">
					<label class="btn btn-default" [class.active]="filterFlags.byLyphTemplate" style="height: 34px; border-radius: 0;" title="Filter by Lyph Template">
						<input name="byLyphTemplate" type="checkbox" data-toggle="button" [checked]="filterFlags.byLyphTemplate">
						<span class="icon icon-LyphTemplate icon-in-button"></span>
					</label>
				</span>
			</div>

			<div style="visibility: hidden; height: 34px"></div>

			<located-measure-view
				*ngFor     = " #model of allResources['locatedMeasures'] | fieldSubstring:filterText:filter:filterFlags "
				 class      = " list-group-item                                                       "
				[modelId]  = " model.id                                                              "
				[highlight] = " filter                                                                "
				(choose)    = " choose.next($event)                                                   "
				(dragging)  = " showTrashcan = !!$event                                               ">
	        </located-measure-view>

			<div style="visibility: hidden; height: 34px"></div>

			<button type="button" class="btn btn-default"
			        style="position: absolute; bottom: -1px; left: 1px; border-radius: 0;"
			        [style.width] = " 'calc(100% - '+scrollbarSize+'px)' "
			        (click)       = " add.next() ">
				<span class="glyphicon glyphicon-plus"></span> Add new Located Measure
			</button>
		</div>

	`,
	styles: [``]
})
export class LocatedMeasureList {

	choose = new EventEmitter;
	add    = new EventEmitter;

	constructor(ref: ChangeDetectorRef, resources: Resources) {
		this.resources = resources;
		this.allResources = resources.getAllResources_sync();
		this.models = this.resources.getAllResources_sync()['locatedMeasures'];
		this.filterFlags = {
			byLyphTemplate: true
		};
		// Can't get [(ngModel)] to work for checkboxes that look like buttons.
		// So we're using jquery change detection and have to manually trigger change detection.
		$(`[name="byLyphTemplate"]`).change(({target:{checked}}) => {
			this.filterFlags = { ...this.filterFlags, byLyphTemplate: checked };
			ref.detectChanges();
		});
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
		this.filterText = this.filterText.bind(this);
	}

	async deleteResource(model) {
		this.showTrashcan = false;
		try {
			await this.resources.deleteResource(model);
		} catch (err) {
			console.dir(err); // TODO: create human readable message for this
		}
	}

	filterText(model, flags) {
		return [
			(model.quality),
			(flags.byLyphTemplate ? this.resources.getResource_sync('lyphTemplates', model.lyphTemplate).name : "")
		].join(' of ');
	}

}
