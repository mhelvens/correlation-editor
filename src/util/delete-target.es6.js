import ng            from 'angular2/angular2';

import {resourceDropAreaHostAttributes, ResourceDropArea} from './resource-drop-area.es6.js';

export const DeleteTarget = ng.Component({
	selector: 'delete-target',
	inputs:   ['show'],
	events: ['catch'],
	host: {
		'[class.highlight]' : ` draggingOver  `,
		'[class.expanded]'  : ` show          `,
		...resourceDropAreaHostAttributes
	},
	template: `

		<div style="display: inline-block; position: absolute; bottom: 3px;">
			<span class="glyphicon glyphicon-trash"></span>
		</div>

	`,
	styles: [`

		:host {
			padding: 0;
			margin: 0;
			position: absolute;
			left: 2px;
			top: -1px;
			z-index: 10;
			font-weight: bold;
			border-bottom-left-radius:  6px;
			border-bottom-right-radius: 6px;
			background-color: #fcc;
			color: #900;
			border: 1px #f00;
			opacity: 0.7;
			border-style: none solid solid solid;
			overflow: hidden;
			text-align: center;
			transition: height 0.4s;
		}

		:host:not(.expanded) { height:  1px !important }
		:host.expanded       { height: 36px !important }

		:host.expanded.highlight {
			background-color: #f88;
			border-color:     #900;
			color: #700;
			opacity:          0.8;
		}

	`]
}).Class({

	constructor: function () {
		this.catch = new ng.EventEmitter();

		this.show          = false;
		this.draggingOver  = false;
	},

	...ResourceDropArea('publication', 'clinicalindex', 'locatedmeasure', 'lyphtemplate', 'correlation'),

	resourceDragEnter(resource) {
		this.draggingOver = true;
	},

	resourceDragLeave(resource) {
		this.draggingOver = false;
	},

	resourceDrop(resource) {
		this.catch.next(resource);
	}

});
