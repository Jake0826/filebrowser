/// <reference types="react" />
import { VDomModel, VDomRenderer, WidgetTracker } from '@jupyterlab/apputils';
import { ITranslator } from '@jupyterlab/translation';
import { FileBrowser, FileBrowserModel } from '.';
/**
 * Status bar item to display file upload progress.
 */
export declare class FileUploadStatus extends VDomRenderer<FileUploadStatus.Model> {
    /**
     * Construct a new FileUpload status item.
     */
    constructor(opts: FileUploadStatus.IOptions);
    /**
     * Render the FileUpload status.
     */
    render(): JSX.Element;
    dispose(): void;
    private _onBrowserChange;
    private readonly translator;
    private _trans;
    private _tracker;
}
/**
 * A namespace for FileUpload class statics.
 */
export declare namespace FileUploadStatus {
    /**
     * The VDomModel for the FileUpload renderer.
     */
    class Model extends VDomModel {
        /**
         * Construct a new model.
         */
        constructor(browserModel: FileBrowserModel | null);
        /**
         * The currently uploading items.
         */
        get items(): IFileUploadItem[];
        /**
         * The current file browser model.
         */
        get browserModel(): FileBrowserModel | null;
        set browserModel(browserModel: FileBrowserModel | null);
        /**
         * Handle an uploadChanged event in the filebrowser model.
         */
        private _uploadChanged;
        private _items;
        private _browserModel;
    }
    /**
     * Options for creating the upload status item.
     */
    interface IOptions {
        /**
         * The application file browser tracker.
         */
        readonly tracker: WidgetTracker<FileBrowser>;
        /**
         * The translation language bundle.
         */
        readonly translator?: ITranslator;
    }
}
/**
 * The interface for an item that is being uploaded to
 * the file system.
 */
interface IFileUploadItem {
    /**
     * The path on the filesystem that is being uploaded to.
     */
    path: string;
    /**
     * The upload progress fraction.
     */
    progress: number;
    /**
     * Whether the upload is complete.
     */
    complete: boolean;
}
export {};
