import ng from 'angular2/angular2';
import $  from 'jquery';

export const GlyphIcon = ng.Component({
	selector: 'glyph-icon',
	inputs:   [ 'glyph', 'color' ],
	host:     { '[class.glyphicon]': ` true `, '[style.color]': ` color ` },
	styles:   [ `:host { display: inline }` ],
	template: ``
}).Class({

	constructor: [ng.ElementRef, function ({nativeElement}) {
		this.nativeElement = $(nativeElement);
	}],

	onChanges({glyph}) {
		this.nativeElement.addClass(`glyphicon-${glyph.currentValue || 'black'}`);
	}

});
