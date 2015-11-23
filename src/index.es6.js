////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import './util/polyfills.es6.js';

import {Component, bootstrap} from 'angular2/angular2';
import $             from 'jquery';
import scrollbarSize from 'scrollbar-size';
import GoldenLayout  from './libs/golden-layout.es6.js';
import                    './libs/bootstrap.es6.js';

import {preloadAllResources} from './util/resources.es6.js';
import {PublicationList}     from './components/publication-list.es6.js';
import {ClinicalIndexList}   from './components/clinical-index-list.es6.js';
import {LocatedMeasureList}  from './components/located-measure-list.es6.js';
import {LyphTemplateList}    from './components/lyph-template-list.es6.js';
import {CorrelationList}     from './components/correlation-list.es6.js';
import {ResourceEditor}      from './util/resource-editor.es6.js';
import {DragDropService}     from './util/drag-drop-service.es6.js';

import './index.scss';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* what to inject into the AngularJS 2 Ecosystem */
const injection = [DragDropService];


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
let [ topLeftPanel , bottomLeftPanel , centerPanel , bottomCenterPanel , topRightPanel , bottomRightPanel ] = await* layout.components
/**/('topLeftPanel','bottomLeftPanel','centerPanel','bottomCenterPanel','topRightPanel','bottomRightPanel');


/* add fade-out effect for center panel */
let fadeout = $(`<div style="
	position:       absolute;
    bottom:         -1px;
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
	fadeout.css('bottom', (gap > 60) ? -1 : gap-60);
});


/* pre-load all resources */
await preloadAllResources();


/* AngularJS 2 app component */
await new Promise((resolve, reject) => {
	try {
		@Component({
			selector: 'app',
			directives: [
				PublicationList,
				ClinicalIndexList,
				LocatedMeasureList,
				LyphTemplateList,
				CorrelationList,
				ResourceEditor
			],
			template: `
				<publication-list     (select) = " openEditor($event) "></publication-list>
				<clinical-index-list  (select) = " openEditor($event) "></clinical-index-list>
				<located-measure-list (select) = " openEditor($event) "></located-measure-list>
				<lyph-template-list   (select) = " openEditor($event) "></lyph-template-list>
				<correlation-list     (select) = " openEditor($event) "></correlation-list>

				<resource-editor
					(close) = " closeEditor() "
					[model] = " selectedModel ">
				</resource-editor>
			`
		})
		class App {
			onInit() { resolve() }
			constructor() {
				this.closeEditor();
			}
			closeEditor() {
				this.selectedModel = null;
				bottomCenterPanel.data('container').setSize(undefined, 1);
			}
			openEditor(model) {
				this.selectedModel = model;
				bottomCenterPanel.data('container').setSize(undefined, 300);
			}
		}
		$('<app>').appendTo('body');
		bootstrap(App, injection);
	} catch (err) { reject(err) }
});


/* populating the panels */
$('publication-list')    .detach().appendTo(topLeftPanel     );
$('clinical-index-list') .detach().appendTo(bottomLeftPanel  );
$('located-measure-list').detach().appendTo(topRightPanel    );
$('lyph-template-list')  .detach().appendTo(bottomRightPanel );
$('correlation-list')    .detach().appendTo(centerPanel      );
$('resource-editor')     .detach().appendTo(bottomCenterPanel);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} catch (err) { console.log('Error:', err) } })();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
