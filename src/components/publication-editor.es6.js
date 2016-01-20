export const publicationEditor = `

	<input #uri="ngForm" title="URI" required [class.control-has-error]="!uri.valid && uri.touched" ngControl="uri" [(ngModel)]="resource.uri" placeholder="URI" type="text" class="form-control">

	<input #title="ngForm" title="Title" [class.control-has-error]="!title.valid && title.touched" ngControl="title" [(ngModel)]="resource.title" placeholder="Title" type="text" class="form-control">

`;
