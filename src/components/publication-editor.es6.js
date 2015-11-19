export const publicationEditor = `

	<input #uri="form" title="URI" required [class.control-has-error]="!uri.valid && uri.touched" ng-control="uri" [(ng-model)]="resource.uri" placeholder="URI" type="text" class="form-control">

	<input #title="form" title="Title" [class.control-has-error]="!title.valid && title.touched" ng-control="title" [(ng-model)]="resource.title" placeholder="Title" type="text" class="form-control">

`;
