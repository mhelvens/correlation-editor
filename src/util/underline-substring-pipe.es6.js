import {Pipe} from 'angular2/angular2';

function escapeForRegex(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

@Pipe({ name: 'underlineSubstring' })
export class UnderlineSubstringPipe {
	transform(string, [substring]) {
		if (!substring || substring.length === 0) { return string }
		return (string || "").replace(new RegExp('('+escapeForRegex(substring || "")+')', 'gi'), '<u>$1</u>');
	}
}
