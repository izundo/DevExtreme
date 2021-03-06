import $ from 'jquery';
import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="fileManager"></div>';
    $('#qunit-fixture').html(markup);
});

import './fileManagerParts/markup.tests.js';
import './fileManagerParts/contextMenu.tests.js';
import './fileManagerParts/detailsView.tests.js';
import './fileManagerParts/thumbnailsView.tests.js';
import './fileManagerParts/toolbar.tests.js';
import './fileManagerParts/navigation.tests.js';
import './fileManagerParts/selection.tests.js';
import './fileManagerParts/scroll.tests.js';
import './fileManagerParts/editing.tests.js';
import './fileManagerParts/adaptivity.tests.js';
import './fileManagerParts/editingProgress.tests.js';
import './fileManagerParts/editingEvents.tests.js';
import './fileManagerParts/progressPanel.tests.js';
import './fileManagerParts/fileItemsController.tests.js';

import './fileManagerParts/common.tests.js';

import './fileManagerParts/arrayProvider.tests.js';
import './fileManagerParts/remoteProvider.tests.js';
import './fileManagerParts/customProvider.tests.js';
