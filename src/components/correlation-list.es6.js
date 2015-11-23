import {NgIf, NgFor, Component, EventEmitter, Inject, ChangeDetectorRef} from 'angular2/angular2';
import $             from 'jquery';
import scrollbarSize from 'scrollbar-size';

import {CorrelationView} from './correlation-view.es6.js';

import {getAllResources_sync, getResource_sync, request} from '../util/resources.es6.js';
import {DeleteTarget}                                    from '../util/delete-target.es6.js';
import {FieldSubstringPipe}                              from '../util/substring-pipe.es6.js';
import {GlyphIcon}                                       from '../util/glyph-icon.es6.js';

@Component({
	selector: 'correlation-list',
	events: ['select'],
	directives: [
		NgFor,
		CorrelationView,
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
	    <div class="input-group"
	         style        = "position: absolute; left: 1px; top: 1px;"
	        [style.width] = "'calc(100% - '+(scrollbarSize)+'px)'">
			<div class="form-group has-feedback">
				<input
					type        = "text"
					class       = "form-control"
					style       = "border-radius: 0"
					placeholder = "Filter Correlations"
					[disabled]  = "!hasFilters()"
					(input)     = "filter = $event.target.value"
					(paste)     = "filter = $event.target.value">
				</input>
				<glyph-icon glyph="filter" class="form-control-feedback" color="gray"></glyph-icon>
			</div>
			<span class="input-group-btn" data-toggle="buttons">
				<label class="btn btn-default" [class.active]="filterFlags.byPublication" style="height: 34px" title="Filter by Publication">
					<input name="byPublication" type="checkbox" data-toggle="button" [checked]="filterFlags.byPublication">
					<span class="icon icon-Publication icon-in-button"></span>
				</label>
				<label class="btn btn-default" [class.active]="filterFlags.byClinicalIndices" style="height: 34px" title="Filter by Clinical Indices">
					<input name="byClinicalIndices" type="checkbox" data-toggle="button" [checked]="filterFlags.byClinicalIndices">
					<span class="icon icon-ClinicalIndex icon-in-button"></span>
				</label>
				<label class="btn btn-default" [class.active]="filterFlags.byLocatedMeasures" style="height: 34px" title="Filter by Located Measures">
					<input name="byLocatedMeasures" type="checkbox" data-toggle="button" [checked]="filterFlags.byLocatedMeasures">
					<span class="icon icon-LocatedMeasure icon-in-button"></span>
				</label>
				<label class="btn btn-default" [class.active]="filterFlags.byComment" style="height: 34px; border-radius: 0;" title="Filter by Comment">
					<input name="byComment" type="checkbox" data-toggle="button" [checked]="filterFlags.byComment">
					<span style="font-weight: bold; font-size: 20px; line-height: 20px; margin: -1px; color: gray;">C</span>
				</label>
			</span>
		</div>

		<div style="visibility: hidden; height: 34px"></div>

		<div class="panel-group" style="margin: 14px">
			<correlation-view
				*ng-for               = " #model of models | fieldSubstring : filterText : (hasFilters()?filter:'') : filterFlags "
				[model-id]            = " model.id                                                                                "
				[highlight]           = " filter                                                                                  "
				[style.margin-bottom] = " '14px'                                                                                  "
				(select)              = " select.next($event)                                                                     "
				(dragging)            = " showTrashcan = !!$event                                                                 ">
	        </correlation-view>
		</div>

	`,
	styles: [``]
})
export class CorrelationList {

	select = new EventEmitter;

	constructor(@Inject(ChangeDetectorRef) ref) {
		this.models = getAllResources_sync('correlations');
		this.filterFlags = {
			byPublication:     true,
			byClinicalIndices: false,
			byLocatedMeasures: false,
			byComment:         false
		};
		// Can't get [(ng-model)] to work for checkboxes that look like buttons.
		// So we're using jquery change detection and have to manually trigger change detection.
		for (let flag of Object.keys(this.filterFlags)) {
			$(`[name="${flag}"]`).change(({target:{checked}}) => {
				this.filterFlags = { ...this.filterFlags, [flag]: checked };
				ref.detectChanges();
			});
		}
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
	}

	hasFilters() {
		return this.filterFlags.byPublication     ||
		       this.filterFlags.byClinicalIndices ||
		       this.filterFlags.byLocatedMeasures ||
		       this.filterFlags.byComment;
	}

	async deleteResource(model) {
		try {
			await request.delete(`/correlations/${model.id}`);
			this.models = this.models.filter(({id}) => id !== model.id);
		} catch (err) {
			console.dir(err); // TODO: create human readable message for this
		}
	}

	filterText(model, flags) {
		return [
			(flags.byComment     ? model.comment                                             : ""),
			(flags.byPublication ? getResource_sync('publications', model.publication).title : ""),
			...(flags.byClinicalIndices ? getResource_sync('clinicalIndices', model.clinicalIndices).map(ci=>ci.title||'') : ""),
			...(flags.byLocatedMeasures ? getResource_sync('locatedMeasures', model.locatedMeasures).map(lm=>lm.quality + ' of ' + (() => {
				let lt = getResource_sync('lyphTemplates', lm.lyphTemplate);
				return lt ? lt.name : '';
			})()) : "")
		].join('   ');
	}

}
