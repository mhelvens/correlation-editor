export const lyphTemplateEditor = `

	<input #name="ngForm" title="Name" required [class.control-has-error]="!name.valid && name.touched" ngControl="name" [(ngModel)]="resource.name" placeholder="Name" required type="text" class="form-control">

`;
