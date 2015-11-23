import {NgFor, Component, EventEmitter, Inject, ElementRef} from 'angular2/angular2';

import $  from 'jquery';


@Component({
	selector: 'glyph-icon',
	inputs:   [ 'glyph', 'color' ],
	host:     { '[class.glyphicon]': ` true `, '[style.color]': ` color ` },
	styles:   [ `:host { display: inline }` ],
	template: ``
})
export class GlyphIcon {

	constructor(@Inject(ElementRef) {nativeElement}) {
		this.nativeElement = $(nativeElement);
	}

	onChanges({glyph}) {
		this.nativeElement.addClass(`glyphicon-${glyph.currentValue || 'black'}`);
	}

}

// TODO: get rid of this component. It does almost nothing.
