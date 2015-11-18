import ng from 'angular2/angular2';
import $  from 'jquery';

import {DragDropService} from '../util/drag-drop-service.es6.js'


export const DeleteTarget = ng.Component({
	selector: 'delete-target',
	inputs:   ['show'],
	events:   ['catch'],
	host: {
		'[class.highlight]' : ` draggingOver  `,
		'[class.expanded]'  : ` show          `,
		...DragDropService.acceptsDrop ('ddr')
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
			visibility: hidden;
			transition: height 0.4s;
		}

		:host:not(.expanded) { height:  1px }
		:host.expanded       { height: 34px }

		:host.expanded.highlight {
			background-color: #f88;
			border-color:     #900;
			color:            #700;
			opacity:          0.8;
		}

	`]
}).Class({

	constructor: [ng.ElementRef, DragDropService, function ({nativeElement}, dd) {
		this.catch = new ng.EventEmitter();
		this.nativeElement = $(nativeElement);
		this.show          = false;
		this.draggingOver  = false;
		this.ddr = dd.recipient(this, {
			acceptedTypes: ['publication', 'clinicalindex', 'locatedmeasure', 'lyphtemplate', 'correlation'],
			dropEffect: 'link',
			dragover:  false,
			dragenter() { this.draggingOver = true;  return false; },
			dragleave() { this.draggingOver = false; return false; },
			drop(resource) {
				this.catch.next(resource);
				this.draggingOver = false;
				return false;
			}
		});
		this._hideCb = () => { this.nativeElement.css('visibility', 'hidden') };
	}],

	onChanges({show}) {
		if (show) {
			if (show.currentValue) {
				this.nativeElement.css('visibility', 'visible');
				this.nativeElement.off('transitionend', this._hideCb);
			} else {
				this.nativeElement.one('transitionend', this._hideCb);
			}
		}
	}

});
