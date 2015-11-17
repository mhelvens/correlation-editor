////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import ng            from 'angular2/angular2';
import $             from 'jquery';
import scrollbarSize from 'scrollbar-size';
import request       from './libs/superagent.es6.js';
import GoldenLayout  from './libs/golden-layout.es6.js';
import                    './libs/bootstrap.es6.js';

import {preloadAllResources} from './util/resources.es6.js';
import {PublicationList}     from './components/publication-list.es6.js';
import {ClinicalIndexList}   from './components/clinical-index-list.es6.js';
import {LocatedMeasureList}  from './components/located-measure-list.es6.js';
import {LyphTemplateList}    from './components/lyph-template-list.es6.js';
import {CorrelationList}     from './components/correlation-list.es6.js';
import {ResourceEditor}      from './util/resource-editor.es6.js';

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
			content: [
				{
					type:   'column',
					width:   25,
					content: [{
						type:          'component',
						componentName: 'topLeftPanel',
						//title:         "Publications"
					}, {
						type:          'component',
						componentName: 'bottomLeftPanel',
						//title:         "Clinical Indices"
					}]
				}, {
					type:   'column',
					width:   50,
					content: [{
						type:          'component',
						height:         85,
						componentName: 'centerPanel',
						//title:         "Correlations"
					}, {
						type:          'component',
						height:         15,
						componentName: 'bottomCenterPanel',
						//title:         "Edit"
					}]
				}, {
					type:   'column',
					width:   25,
					content: [{
						type:          'component',
						componentName: 'topRightPanel',
						//title:         "Located Measures"
					}, {
						type:          'component',
						componentName: 'bottomRightPanel',
						//title:         "Lyph Templates"
					}]
				}
			]
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
			let App = ng.Component({
				selector: 'app'
			}).View({directives: [
				PublicationList,
				ClinicalIndexList,
				LocatedMeasureList,
				LyphTemplateList,
				CorrelationList,
				ResourceEditor
			], template: `
				<publication-list     (select) = "selectedModel = $event"                        ></publication-list>
				<clinical-index-list  (select) = "selectedModel = $event"                        ></clinical-index-list>
				<located-measure-list (select) = "selectedModel = $event"                        ></located-measure-list>
				<lyph-template-list   (select) = "selectedModel = $event"                        ></lyph-template-list>
				<correlation-list     (select) = "selectedModel = $event"                        ></correlation-list>
				<resource-editor      (cancel) = "selectedModel = null" [model] = "selectedModel"></resource-editor>
			`}).Class({
				constructor() {

					this.selectedModel = null;

				},
				onInit: resolve
			});
			$('<app>').appendTo('body');
			ng.bootstrap(App);
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
