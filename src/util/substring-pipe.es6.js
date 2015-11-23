import {Pipe} from 'angular2/angular2';


@Pipe({ name: 'fieldSubstring' })
export class FieldSubstringPipe {
	transform(list, [filterText, string, flags = {}]) {
		return list.filter(item =>
			(filterText(item, flags) || "")
				.toLowerCase()
				.includes((string || "").trim().toLowerCase())
		);
	}
}
