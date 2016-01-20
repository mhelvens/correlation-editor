export const correlationEditor = `

	<textarea #comment="ngForm" title="Comment" required [class.control-has-error]="!comment.valid && comment.touched" ngControl="comment" [(ngModel)]="resource.comment" placeholder="Comment" class="form-control" rows="3"></textarea>

	<div  class      = " badge-container "
	     (dragover)  = " ddc($event)     "
	     (dragenter) = " ddc($event)     "
	     (dragleave) = " ddc($event)     "
	     (drop)      = " ddc($event)     ">
		<publication-badge
			*ngIf      = " resource.publication    "
			[modelId]  = " resource.publication    "
			(dragging)  = " showTrashcan = !!$event ">
		</publication-badge><!--
		--><clinical-index-badge
			*ngFor     = " #id of resource.clinicalIndices "
			[modelId]  = "  id                             "
			(dragging)  = " showTrashcan = !!$event         ">
		</clinical-index-badge><!--
		--><located-measure-badge
			*ngFor     = " #id of resource.locatedMeasures "
			[modelId]  = "  id                             "
			(dragging)  = " showTrashcan = !!$event         ">
		</located-measure-badge>
		<span class="fake-placeholder" *ngIf="!resource.publication && !resource.clinicalIndices?.length && !resource.locatedMeasures?.length">
			 Publication & Correlates
		</span>
	</div>

`;
