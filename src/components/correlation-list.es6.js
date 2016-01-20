import {Component, EventEmitter, ChangeDetectorRef, ElementRef} from 'angular2/core';
import $             from 'jquery';
import scrollbarSize from 'scrollbar-size';

import {CorrelationView} from './correlation-view.es6.js';

import {Resources, request}           from '../util/resources.es6.js';
import {DeleteTarget}                                    from '../util/delete-target.es6.js';
import {FieldSubstringPipe}                              from '../util/substring-pipe.es6.js';
import {GlyphIcon}                                       from '../util/glyph-icon.es6.js';

@Component({
	selector: 'correlation-list',
	events: ['choose', 'add'],
	directives: [
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
					class       = "form-control filter-textbox"
					style       = "border-radius: 0"
					placeholder = "Filter Correlations"
					[disabled]  = "!hasFilters()"
					(input)     = "filter = $event.target.value"
					(paste)     = "filter = $event.target.value">
				<span class="form-control-feedback" style="font-size: 10px; color: gray; width: auto; margin-right: 8px;">{{(allResources['correlations'] | fieldSubstring : filterText : (hasFilters()?filter:'') : filterFlags).length}} / {{allResources['correlations'].length}}</span>
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
				*ngFor               = " #model of allResources['correlations'] | fieldSubstring : filterText : (hasFilters()?filter:'') : filterFlags "
				[modelId]            = " model.id                                                                                "
				[highlight]           = " filter                                                                                  "
				[style.margin-bottom] = " '14px'                                                                                  "
				(choose)              = " choose.next($event)                                                                     "
				(dragging)            = " showTrashcan = !!$event                                                                 ">
	        </correlation-view>
		</div>

		<div style="visibility: hidden; height: 34px"></div>

		<button type="button" class="btn btn-default"
		        style="position: absolute; bottom: 0; left: 1px; border-radius: 0;"
		        [style.width] = " 'calc(100% - '+scrollbarSize+'px)' "
		        (click)       = " add.next() ">
			<span class="glyphicon glyphicon-plus"></span> Add new Correlation
		</button>

	`,
	styles: [``]
})
export class CorrelationList {

	choose = new EventEmitter;
	add    = new EventEmitter;

	constructor({nativeElement}: ElementRef, ref: ChangeDetectorRef, resources: Resources) {
		this.resources = resources;
		this.nativeElement = nativeElement;
		this.allResources = resources.getAllResources_sync();
		this.models = resources.getAllResources_sync()['correlations'];
		this.filterFlags = {
			byPublication:     true,
			byClinicalIndices: false,
			byLocatedMeasures: false,
			byComment:         false
		};
		// Can't get [(ngModel)] to work for checkboxes that look like buttons.
		// So we're using jquery change detection and have to manually trigger change detection.
		for (let flag of Object.keys(this.filterFlags)) {
			$(`[name="${flag}"]`).change(({target:{checked}}) => {
				this.filterFlags = { ...this.filterFlags, [flag]: checked };
				ref.detectChanges();
			});
		}
		this.scrollbarSize = scrollbarSize();
		this.showTrashcan = false;
		this.filterText = this.filterText.bind(this);
	}

	hasFilters() {
		return this.filterFlags.byPublication     ||
		       this.filterFlags.byClinicalIndices ||
		       this.filterFlags.byLocatedMeasures ||
		       this.filterFlags.byComment;
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
			(flags.byComment     ? model.comment                                                            : ""),
			(flags.byPublication ? this.publicationFilterText(this.resources.getResource_sync('publications', model.publication)) : ""),
			...(flags.byClinicalIndices ? this.resources.getResource_sync('clinicalIndices', model.clinicalIndices).map(ci=>ci.title||'') : ""),
			...(flags.byLocatedMeasures ? this.resources.getResource_sync('locatedMeasures', model.locatedMeasures).map(lm=>lm.quality + ' of ' + (() => {
				let lt = this.resources.getResource_sync('lyphTemplates', lm.lyphTemplate);
				return lt ? lt.name : '';
			})()) : "")
		].join('   ');
	}

	filterByModel(model) {
		switch (model.type) {
			case 'Publication': {
				this.filterFlags.byPublication = true;
				this.filter = this.publicationFilterText(model);
			} break;
			case 'ClinicalIndex': {
				this.filterFlags.byClinicalIndices = true;
				this.filter = model.title || '';
			} break;
			case 'LocatedMeasure': {
				this.filterFlags.byLocatedMeasures = true;
				this.filter = model.quality + ' of ' + (() => {
						let lt = this.resources.getResource_sync('lyphTemplates', model.lyphTemplate);
						return lt ? lt.name : '';
					})();
			} break;
			case 'LyphTemplate': {
				this.filterFlags.byLocatedMeasures = true; // byLocatedMeasures is correct here
				this.filter = model.name || '';
			} break;
		}
		$(this.nativeElement).find('.filter-textbox').val(this.filter);
	}

	publicationFilterText(model) {
		if (!model)       { return "" }
		if (!model.title) { return model.uri }

		/* extract pubmed-id if applicable */
		let match = model.uri.match(/^https?\:\/\/www\.ncbi\.nlm\.nih\.gov\/pubmed\/\?term\=(\w+)/);
		if (match) { return `${model.title} (${match[1]})` }

		return model.title;
	}

}
