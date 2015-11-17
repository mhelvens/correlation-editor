import GoldenLayout from 'golden-layout/dist/goldenlayout';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-light-theme.css';

export default class extends GoldenLayout {
	components(...components) {
		super.init();
		return components.map(name => new Promise((resolve, reject) => {
			try {
				super.registerComponent(name, (container/*, state*/) => {
					resolve(container.getElement());
				});
			} catch (err) { reject(err) }
		}));
	}
}
