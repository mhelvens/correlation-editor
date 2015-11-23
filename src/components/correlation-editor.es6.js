export const correlationEditor = `

	<textarea #comment="form" title="Comment" required [class.control-has-error]="!comment.valid && comment.touched" ng-control="comment" [(ng-model)]="resource.comment" placeholder="Comment" class="form-control" rows="3"></textarea>

	<div  class      = " badge-container "
	     (dragover)  = " ddc($event)     "
	     (dragenter) = " ddc($event)     "
	     (dragleave) = " ddc($event)     "
	     (drop)      = " ddc($event)     ">
		<publication-badge
			*ng-if      = " resource.publication    "
			[model-id]  = " resource.publication    "
			(dragging)  = " showTrashcan = !!$event ">
		</publication-badge><!--
		--><clinical-index-badge
			*ng-for     = " #id of resource.clinicalIndices "
			[model-id]  = "  id                             "
			(dragging)  = " showTrashcan = !!$event         ">
		</clinical-index-badge><!--
		--><located-measure-badge
			*ng-for     = " #id of resource.locatedMeasures "
			[model-id]  = "  id                             "
			(dragging)  = " showTrashcan = !!$event         ">
		</located-measure-badge>
		<span class="fake-placeholder" *ng-if="!resource.publication && !resource.clinicalIndices.length && !resource.locatedMeasures.length">
			 Publication & Correlates
		</span>
	</div>

`;
