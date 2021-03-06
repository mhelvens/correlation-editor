export const locatedMeasureEditor = `

	<div class="form-horizontal">
	    <div class="form-group">
		    <div class="col-sm-11">
				<input #quality="ngForm" title="Quality" required [class.control-has-error]="!quality.valid && quality.touched" ngControl="quality" [(ngModel)]="resource.quality" placeholder="Quality" id="quality-{{model.id}}" type="text" class="form-control" style="margin-bottom: 0">
		    </div>
		    <label [attr.for]="'quality-'+model.id" class="col-sm-1 control-label" style="text-align: left; position: relative; left: -6px;">of</label>
	    </div>
	</div>

	<div  class      = " badge-container "
         (dragover)  = " ddlm($event)    "
         (dragenter) = " ddlm($event)    "
         (dragleave) = " ddlm($event)    "
         (drop)      = " ddlm($event)    ">
		<lyph-template-badge
			*ngIf      = " resource.lyphTemplate   "
			[modelId]  = " resource.lyphTemplate   "
			(dragging)  = " showTrashcan = !!$event ">
		</lyph-template-badge>
		<span class="fake-placeholder" *ngIf="!resource.lyphTemplate">
			Lyph Template
		</span>
	</div>


`;
