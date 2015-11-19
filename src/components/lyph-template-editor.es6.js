export const lyphTemplateEditor = `

	<input #name="form" title="Name" required [class.control-has-error]="!name.valid && name.touched" ng-control="name" [(ng-model)]="resource.name" placeholder="Name" required type="text" class="form-control">

`;
