import ng from 'angular2/angular2';

export const ResourceEditor = ng.Component({
	selector: 'resource-editor',
	inputs:   ['model'],
	events:   ['cancel'],
	host: {},
	pipes: [],
	templates: [
		ng.NgSwitch
	],
	template: `

		<div></div>
		<div [ng-switch]="model?.type" style="height: 100%">
			<div *ng-switch-when=" 'Publication'    " (click)="cancel.next()">Publication:    {{model.id}}</div>
			<div *ng-switch-when=" 'ClinicalIndex'  " (click)="cancel.next()">ClinicalIndex:  {{model.id}}</div>
			<div *ng-switch-when=" 'LocatedMeasure' " (click)="cancel.next()">LocatedMeasure: {{model.id}}</div>
			<div *ng-switch-when=" 'LyphTemplate'   " (click)="cancel.next()">LyphTemplate:   {{model.id}}</div>
			<div *ng-switch-when=" 'Correlation'    " (click)="cancel.next()">Correlation:    {{model.id}}</div>
			<div *ng-switch-default style="display: flex; justify-content: center; align-items: center; font-weight: bold; height: 100%;">
				click on a resource to edit it
			</div>
		</div>

	`,
	styles: [`



	`]
}).Class({

	constructor() {

		this.cancel = new ng.EventEmitter();
		this.JSON = JSON;

	}

});
