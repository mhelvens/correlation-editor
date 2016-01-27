import {Pipe} from 'angular2/core';


@Pipe({ name: 'filter' })
export class FilterPipe {
	transform(list, [pred]) {
		return list.filter(pred);
	}
}
