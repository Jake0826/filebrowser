// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
import { showErrorMessage, ToolbarButton } from '@jupyterlab/apputils';
import { nullTranslator } from '@jupyterlab/translation';
import { fileUploadIcon } from '@jupyterlab/ui-components';
/**
 * A widget which provides an upload button.
 */
export class Uploader extends ToolbarButton {
    /**
     * Construct a new file browser buttons widget.
     */
    constructor(options) {
        super({
            icon: fileUploadIcon,
            onClick: () => {
                this._input.click();
            },
            tooltip: Private.translateToolTip(options.translator)
        });
        /**
         * The 'change' handler for the input field.
         */
        this._onInputChanged = () => {
            const files = Array.prototype.slice.call(this._input.files);
            const pending = files.map(file => this.fileBrowserModel.upload(file));
            void Promise.all(pending).catch(error => {
                void showErrorMessage(this._trans._p('showErrorMessage', 'Upload Error'), error);
            });
        };
        /**
         * The 'click' handler for the input field.
         */
        this._onInputClicked = () => {
            // In order to allow repeated uploads of the same file (with delete in between),
            // we need to clear the input value to trigger a change event.
            this._input.value = '';
        };
        this._input = Private.createUploadInput();
        this.fileBrowserModel = options.model;
        this.translator = options.translator || nullTranslator;
        this._trans = this.translator.load('jupyterlab');
        this._input.onclick = this._onInputClicked;
        this._input.onchange = this._onInputChanged;
        this.addClass('jp-id-upload');
    }
}
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * Create the upload input node for a file buttons widget.
     */
    function createUploadInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        return input;
    }
    Private.createUploadInput = createUploadInput;
    /**
     * Translate upload tooltip.
     */
    function translateToolTip(translator) {
        translator = translator || nullTranslator;
        const trans = translator.load('jupyterlab');
        return trans.__('Upload Files');
    }
    Private.translateToolTip = translateToolTip;
})(Private || (Private = {}));
//# sourceMappingURL=upload.js.map