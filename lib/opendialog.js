// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { Dialog, setToolbar, ToolbarButton } from '@jupyterlab/apputils';
import { PathExt } from '@jupyterlab/coreutils';
import { nullTranslator } from '@jupyterlab/translation';
import { newFolderIcon, refreshIcon } from '@jupyterlab/ui-components';
import { toArray } from '@lumino/algorithm';
import { PanelLayout, Widget } from '@lumino/widgets';
import { FileBrowser } from './browser';
import { FilterFileBrowserModel } from './model';
/**
 * The class name added to open file dialog
 */
const OPEN_DIALOG_CLASS = 'jp-Open-Dialog';
/**
 * Namespace for file dialog
 */
export var FileDialog;
(function (FileDialog) {
    /**
     * Create and show a open files dialog.
     *
     * Note: if nothing is selected when `getValue` will return the browser
     * model current path.
     *
     * @param options - The dialog setup options.
     *
     * @returns A promise that resolves with whether the dialog was accepted.
     */
    function getOpenFiles(options) {
        const translator = options.translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        const dialogOptions = {
            title: options.title,
            buttons: [
                Dialog.cancelButton({ label: trans.__('Cancel') }),
                Dialog.okButton({
                    label: trans.__('Select')
                })
            ],
            focusNodeSelector: options.focusNodeSelector,
            host: options.host,
            renderer: options.renderer,
            body: new OpenDialog(options.manager, options.filter, translator)
        };
        const dialog = new Dialog(dialogOptions);
        return dialog.launch();
    }
    FileDialog.getOpenFiles = getOpenFiles;
    /**
     * Create and show a open directory dialog.
     *
     * Note: if nothing is selected when `getValue` will return the browser
     * model current path.
     *
     * @param options - The dialog setup options.
     *
     * @returns A promise that resolves with whether the dialog was accepted.
     */
    function getExistingDirectory(options) {
        return getOpenFiles(Object.assign(Object.assign({}, options), { filter: model => null }));
    }
    FileDialog.getExistingDirectory = getExistingDirectory;
})(FileDialog || (FileDialog = {}));
/**
 * Open dialog widget
 */
class OpenDialog extends Widget {
    constructor(manager, filter, translator) {
        super();
        translator = translator !== null && translator !== void 0 ? translator : nullTranslator;
        const trans = translator.load('jupyterlab');
        this.addClass(OPEN_DIALOG_CLASS);
        this._browser = Private.createFilteredFileBrowser('filtered-file-browser-dialog', manager, filter, {}, translator);
        // Add toolbar items
        setToolbar(this._browser, (browser) => [
            {
                name: 'new-folder',
                widget: new ToolbarButton({
                    icon: newFolderIcon,
                    onClick: () => {
                        browser.createNewDirectory();
                    },
                    tooltip: trans.__('New Folder')
                })
            },
            {
                name: 'refresher',
                widget: new ToolbarButton({
                    icon: refreshIcon,
                    onClick: () => {
                        browser.model.refresh().catch(reason => {
                            console.error('Failed to refresh file browser in open dialog.', reason);
                        });
                    },
                    tooltip: trans.__('Refresh File List')
                })
            }
        ]);
        // Build the sub widgets
        const layout = new PanelLayout();
        layout.addWidget(this._browser);
        // Set Widget content
        this.layout = layout;
    }
    /**
     * Get the selected items.
     */
    getValue() {
        const selection = toArray(this._browser.selectedItems());
        if (selection.length === 0) {
            // Return current path
            return [
                {
                    path: this._browser.model.path,
                    name: PathExt.basename(this._browser.model.path),
                    type: 'directory',
                    content: undefined,
                    writable: false,
                    created: 'unknown',
                    last_modified: 'unknown',
                    mimetype: 'text/plain',
                    format: 'text'
                }
            ];
        }
        else {
            return selection;
        }
    }
}
var Private;
(function (Private) {
    /**
     * Create a new file browser instance.
     *
     * @param id - The widget/DOM id of the file browser.
     *
     * @param manager - A document manager instance.
     *
     * @param filter - function to filter file browser item.
     *
     * @param options - The optional file browser configuration object.
     *
     * #### Notes
     * The ID parameter is used to set the widget ID. It is also used as part of
     * the unique key necessary to store the file browser's restoration data in
     * the state database if that functionality is enabled.
     *
     * If, after the file browser has been generated by the factory, the ID of the
     * resulting widget is changed by client code, the restoration functionality
     * will not be disrupted as long as there are no ID collisions, i.e., as long
     * as the initial ID passed into the factory is used for only one file browser
     * instance.
     */
    Private.createFilteredFileBrowser = (id, manager, filter, options = {}, translator) => {
        translator = translator || nullTranslator;
        const model = new FilterFileBrowserModel({
            manager,
            filter,
            translator,
            driveName: options.driveName,
            refreshInterval: options.refreshInterval
        });
        const widget = new FileBrowser({
            id,
            model,
            translator
        });
        return widget;
    };
})(Private || (Private = {}));
//# sourceMappingURL=opendialog.js.map