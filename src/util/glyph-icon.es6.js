import {Component, EventEmitter, ElementRef} from 'angular2/core';

import $  from 'jquery';


@Component({
	selector: 'glyph-icon',
	inputs:   [ 'glyph', 'color' ],
	host:     { '[class.glyphicon]': ` true `, '[style.color]': ` color ` },
	styles:   [ `:host { display: inline }` ],
	template: ``
})
export class GlyphIcon {

	constructor({nativeElement}: ElementRef) {
		this.nativeElement = $(nativeElement);
	}

	ngOnChanges({glyph}) {
		this.nativeElement.addClass(`glyphicon-${glyph.currentValue || 'black'}`);
	}

}

// TODO: get rid of this component. It does almost nothing.
