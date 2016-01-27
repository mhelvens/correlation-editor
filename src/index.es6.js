////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import './util/polyfills.es6.js';

import {bootstrap}                          from 'angular2/bootstrap';
import {Component, provide, enableProdMode} from 'angular2/core';
import $             from 'jquery';
import scrollbarSize from 'scrollbar-size';
import GoldenLayout  from './libs/golden-layout.es6.js';
import                    './libs/bootstrap.es6.js';

import {Resources}                     from './util/resources.es6.js';
import {PublicationList}               from './components/publication-list.es6.js';
import {ClinicalIndexList}             from './components/clinical-index-list.es6.js';
import {ClinicalIndexHierarchicalList} from './components/clinical-index-hierarchical-list.es6.js';
import {LocatedMeasureList}            from './components/located-measure-list.es6.js';
import {LyphTemplateList}              from './components/lyph-template-list.es6.js';
import {CorrelationList}               from './components/correlation-list.es6.js';
import {ResourceEditor}                from './util/resource-editor.es6.js';
import {DragDropService}               from './util/drag-drop-service.es6.js';

import './index.scss';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(async () => { try {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* golden layout setup */
let layout = new GoldenLayout({
	settings: { hasHeaders: false },
	dimensions: {
		minItemWidth:  200,
		minItemHeight: 200,
	},
	content: [{
		type: 'row',
		content: [{
			type:   'column',
			width:   25,
			content: [{
				type:          'component',
				componentName: 'topLeftPanel'
			}, {
				type:          'component',
				componentName: 'bottomLeftPanel'
			}]
		}, {
			type:   'column',
			width:   50,
			content: [{
				type:          'component',
				height:         75,
				componentName: 'centerPanel'
			}, {
				type:          'component',
				height:         25,
				componentName: 'bottomCenterPanel',
				componentState: { startClosed: true }
			}]
		}, {
			type:   'column',
			width:   25,
			content: [{
				type:          'component',
				componentName: 'topRightPanel'
			}, {
				type:          'component',
				componentName: 'bottomRightPanel'
			}]
		}]
	}]
});


/* get the jQuery panel elements */
let [ topLeftPanel , bottomLeftPanel , centerPanel , bottomCenterPanel , topRightPanel , bottomRightPanel ] = await Promise.all(layout.components
/**/('topLeftPanel','bottomLeftPanel','centerPanel','bottomCenterPanel','topRightPanel','bottomRightPanel'));


/* add fade-out effect for center panel */
let fadeout = $(`<div style="
	position:       absolute;
    bottom:         33px;
    left:            1px;
    height:         60px;
    right:          ${scrollbarSize()-1}px;
    z-index:        9;
    pointer-events: none;
    background:     linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);">
`).appendTo(centerPanel.parent());
centerPanel.parent().css('overflow', 'hidden');
centerPanel.scroll(() => {
	let gap = centerPanel[0].scrollHeight - centerPanel.scrollTop() - centerPanel.height();
	fadeout.css('bottom', (gap > 60) ? 33 : gap-22);
});


/* pre-load all resources */
let resources = new Resources;
await resources.preloadAllResources();


/* AngularJS 2 app component */
await new Promise((resolve, reject) => {
	try {
		@Component({
			selector: 'app',
			directives: [
				PublicationList,
				//ClinicalIndexList,
				ClinicalIndexHierarchicalList,
				LocatedMeasureList,
				LyphTemplateList,
				CorrelationList,
				ResourceEditor
			],
			template: `

				<publication-list                 (choose)="choose($event,   cList)" (add)="add('Publication'   )"></publication-list>
				<clinical-index-hierarchical-list (choose)="choose($event,   cList)" (add)="add('ClinicalIndex' )"></clinical-index-hierarchical-list>
				<located-measure-list             (choose)="choose($event,   cList)" (add)="add('LocatedMeasure')"></located-measure-list>
				<lyph-template-list               (choose)="choose($event,   cList)" (add)="add('LyphTemplate'  )"></lyph-template-list>
				<correlation-list                 (choose)="choose($event)" #cList   (add)="add('Correlation'   )"></correlation-list>

				<resource-editor
					(close) = " closeEditor() "
					[model] = " selectedModel ">
				</resource-editor>

			`
		})
		class App {
			ngOnInit() { resolve() }
			constructor() {
				this.closeEditor();
			}
			closeEditor() {
				this.selectedModel = null;
				bottomCenterPanel.data('container').setSize(undefined, 1);
			}
			choose({event, model}, cList) {
				if (event.type !== 'click') { return }
				if (!event.ctrlKey) {
					this.selectedModel = model;
					bottomCenterPanel.data('container').setSize(undefined, 300);
				} else if (event.ctrlKey && cList) {
					cList.filterByModel(model);
				}
			}
			add(type) {
				this.selectedModel = { type };
				bottomCenterPanel.data('container').setSize(undefined, 300);
			}
		}

		$('<app>').appendTo('body');

		enableProdMode(); // TODO: try to fix all 'errors' caused by dev-mode?
		bootstrap(App, [
			DragDropService,
			provide(Resources, {useValue: resources})
		]);
	} catch (err) { reject(err) }
});


/* populating the panels */
$('app > publication-list')                .detach().appendTo(topLeftPanel     );
$('app > clinical-index-hierarchical-list').detach().appendTo(bottomLeftPanel  );
$('app > located-measure-list')            .detach().appendTo(topRightPanel    );
$('app > lyph-template-list')              .detach().appendTo(bottomRightPanel );
$('app > correlation-list')                .detach().appendTo(centerPanel      );
$('app > resource-editor')                 .detach().appendTo(bottomCenterPanel);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} catch (err) { console.log('Error:', err) } })();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
