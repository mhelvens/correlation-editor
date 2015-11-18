import ng from 'angular2/angular2';

import {DragDropService}        from '../util/drag-drop-service.es6.js'
import {UnderlineSubstringPipe} from '../util/underline-substring-pipe.es6.js';
import {EscapeHtmlPipe}         from '../util/escape-html-pipe.es6.js';


export const PublicationView = ng.Component({
	selector: '[publication]',
	inputs:   ['model: publication', 'highlight'],
	events: ['select', 'dragging'],
	host: {
		'[style.borderColor]':     ' "#999"                   ',
		'[title]':                 ' model.title || model.uri ',
		...DragDropService.canBeDragged('dds')
	},
	pipes: [
		UnderlineSubstringPipe,
		EscapeHtmlPipe
	],
	template: `

		<div class="resource-view" (click)="select.next(model)">
			<div class="icon icon-pubmed"></div>
			<div class="text-content" [inner-html]="(model.title || model.uri) | escapeHTML | underlineSubstring:highlight"></div>
			<a *ng-if = "uriIsUrl()"
			   class  = "link glyphicon glyphicon-new-window"
			   [href] = "model.uri"
			   target = "_blank"></a>
		</div>

	`,
	styles: [`

		:host       { background-color: #eff !important }
		:host:hover { background-color: #cff !important }

		:host .text-content {
			font-style: italic;
		}

	`]
}).Class({

	constructor: [DragDropService, function(dd) {
		this.select   = new ng.EventEmitter();
		this.dragging = new ng.EventEmitter();
		this.dds = dd.sender(this, {
			resourceKey:   'model',
			effectAllowed: 'link',
			dragstart() { this.dragging.next(this.model); return false; },
			dragend()   { this.dragging.next(null);       return false; }
		});
	}],

	uriIsUrl() { return /^https?\:\/\//.test(this.model.uri) }

});
