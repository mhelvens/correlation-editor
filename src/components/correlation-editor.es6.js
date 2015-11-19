export const correlationEditor = `

	<textarea #comment="form" title="Comment" required [class.control-has-error]="!comment.valid && comment.touched" ng-control="comment" [(ng-model)]="resource.comment" placeholder="Comment" class="form-control" rows="3"></textarea>

	<div  class      = " badge-container "
	     (dragover)  = " ddc($event)     "
	     (dragenter) = " ddc($event)     "
	     (dragleave) = " ddc($event)     "
	     (drop)      = " ddc($event)     ">
		<publication-badge
			*ng-if      = " publicationModel        "
			[model]     = " publicationModel        "
			(dragging)  = " showTrashcan = !!$event ">
		</publication-badge><!--
		--><clinical-index-badge
			*ng-for     = " #ciModel of clinicalIndexModels "
			[model]     = " ciModel                         "
			(dragging)  = " showTrashcan = !!$event         ">
		</clinical-index-badge><!--
		--><located-measure-badge
			*ng-for     = " #lmModel of locatedMeasureModels "
			[model]     = " lmModel                          "
			(dragging)  = " showTrashcan = !!$event          ">
		</located-measure-badge>
		<span class="fake-placeholder" *ng-if="!publicationModel && !clinicalIndexModels.length && !locatedMeasureModels.length">
			 Publication & Correlates
		</span>
	</div>

`;
