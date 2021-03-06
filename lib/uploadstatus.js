// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
//
import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';
import { GroupItem, ProgressBar, TextItem } from '@jupyterlab/statusbar';
import { nullTranslator } from '@jupyterlab/translation';
import { ArrayExt } from '@lumino/algorithm';
import React from 'react';
/**
 * Half-spacing between items in the overall status item.
 */
const HALF_SPACING = 4;
/**
 * A pure function component for a FileUpload status item.
 *
 * @param props: the props for the component.
 *
 * @returns a tsx component for the file upload status.
 */
function FileUploadComponent(props) {
    const translator = props.translator || nullTranslator;
    const trans = translator.load('jupyterlab');
    return (React.createElement(GroupItem, { spacing: HALF_SPACING },
        React.createElement(TextItem, { source: trans.__('Uploadingâ€¦') }),
        React.createElement(ProgressBar, { percentage: props.upload })));
}
/**
 * The time for which to show the "Complete!" message after uploading.
 */
const UPLOAD_COMPLETE_MESSAGE_MILLIS = 2000;
/**
 * Status bar item to display file upload progress.
 */
export class FileUploadStatus extends VDomRenderer {
    /**
     * Construct a new FileUpload status item.
     */
    constructor(opts) {
        super(new FileUploadStatus.Model(opts.tracker.currentWidget && opts.tracker.currentWidget.model));
        this._onBrowserChange = (tracker, browser) => {
            if (browser === null) {
                this.model.browserModel = null;
            }
            else {
                this.model.browserModel = browser.model;
            }
        };
        this.translator = opts.translator || nullTranslator;
        this._trans = this.translator.load('jupyterlab');
        this._tracker = opts.tracker;
        this._tracker.currentChanged.connect(this._onBrowserChange);
    }
    /**
     * Render the FileUpload status.
     */
    render() {
        const uploadPaths = this.model.items;
        if (uploadPaths.length > 0) {
            const item = this.model.items[0];
            if (item.complete) {
                return React.createElement(TextItem, { source: this._trans.__('Complete!') });
            }
            else {
                return (React.createElement(FileUploadComponent, { upload: this.model.items[0].progress, translator: this.translator }));
            }
        }
        else {
            return React.createElement(FileUploadComponent, { upload: 100, translator: this.translator });
        }
    }
    dispose() {
        super.dispose();
        this._tracker.currentChanged.disconnect(this._onBrowserChange);
    }
}
/**
 * A namespace for FileUpload class statics.
 */
(function (FileUploadStatus) {
    /**
     * The VDomModel for the FileUpload renderer.
     */
    class Model extends VDomModel {
        /**
         * Construct a new model.
         */
        constructor(browserModel) {
            super();
            /**
             * Handle an uploadChanged event in the filebrowser model.
             */
            this._uploadChanged = (browse, uploads) => {
                if (uploads.name === 'start') {
                    this._items.push({
                        path: uploads.newValue.path,
                        progress: uploads.newValue.progress * 100,
                        complete: false
                    });
                }
                else if (uploads.name === 'update') {
                    const idx = ArrayExt.findFirstIndex(this._items, val => val.path === uploads.oldValue.path);
                    if (idx !== -1) {
                        this._items[idx].progress = uploads.newValue.progress * 100;
                    }
                }
                else if (uploads.name === 'finish') {
                    const idx = ArrayExt.findFirstIndex(this._items, val => val.path === uploads.oldValue.path);
                    if (idx !== -1) {
                        this._items[idx].complete = true;
                        setTimeout(() => {
                            ArrayExt.removeAt(this._items, idx);
                            this.stateChanged.emit(void 0);
                        }, UPLOAD_COMPLETE_MESSAGE_MILLIS);
                    }
                }
                else if (uploads.name === 'failure') {
                    ArrayExt.removeFirstWhere(this._items, val => val.path === uploads.newValue.path);
                }
                this.stateChanged.emit(void 0);
            };
            this._items = [];
            this._browserModel = null;
            this.browserModel = browserModel;
        }
        /**
         * The currently uploading items.
         */
        get items() {
            return this._items;
        }
        /**
         * The current file browser model.
         */
        get browserModel() {
            return this._browserModel;
        }
        set browserModel(browserModel) {
            const oldBrowserModel = this._browserModel;
            if (oldBrowserModel) {
                oldBrowserModel.uploadChanged.disconnect(this._uploadChanged);
            }
            this._browserModel = browserModel;
            this._items = [];
            if (this._browserModel !== null) {
                this._browserModel.uploadChanged.connect(this._uploadChanged);
            }
            this.stateChanged.emit(void 0);
        }
    }
    FileUploadStatus.Model = Model;
})(FileUploadStatus || (FileUploadStatus = {}));
//# sourceMappingURL=uploadstatus.js.map