import { IScore } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { Contents, KernelSpec, Session } from '@jupyterlab/services';
import { IStateDB } from '@jupyterlab/statedb';
import { ITranslator } from '@jupyterlab/translation';
import { IIterator, IterableOrArrayLike } from '@lumino/algorithm';
import { IDisposable } from '@lumino/disposable';
import { ISignal } from '@lumino/signaling';
/**
 * The maximum upload size (in bytes) for notebook version < 5.1.0
 */
export declare const LARGE_FILE_SIZE: number;
/**
 * The size (in bytes) of the biggest chunk we should upload at once.
 */
export declare const CHUNK_SIZE: number;
/**
 * An upload progress event for a file at `path`.
 */
export interface IUploadModel {
    path: string;
    /**
     * % uploaded [0, 1)
     */
    progress: number;
}
/**
 * An implementation of a file browser model.
 *
 * #### Notes
 * All paths parameters without a leading `'/'` are interpreted as relative to
 * the current directory.  Supports `'../'` syntax.
 */
export declare class FileBrowserModel implements IDisposable {
    /**
     * Construct a new file browser model.
     */
    constructor(options: FileBrowserModel.IOptions);
    /**
     * The document manager instance used by the file browser model.
     */
    readonly manager: IDocumentManager;
    /**
     * A signal emitted when the file browser model loses connection.
     */
    get connectionFailure(): ISignal<this, Error>;
    /**
     * The drive name that gets prepended to the path.
     */
    get driveName(): string;
    /**
     * A promise that resolves when the model is first restored.
     */
    get restored(): Promise<void>;
    /**
     * Get the file path changed signal.
     */
    get fileChanged(): ISignal<this, Contents.IChangedArgs>;
    /**
     * Get the current path.
     */
    get path(): string;
    /**
     * Get the root path
     */
    get rootPath(): string;
    /**
     * A signal emitted when the path changes.
     */
    get pathChanged(): ISignal<this, IChangedArgs<string>>;
    /**
     * A signal emitted when the directory listing is refreshed.
     */
    get refreshed(): ISignal<this, void>;
    /**
     * Get the kernel spec models.
     */
    get specs(): KernelSpec.ISpecModels | null;
    /**
     * Get whether the model is disposed.
     */
    get isDisposed(): boolean;
    /**
     * A signal emitted when an upload progresses.
     */
    get uploadChanged(): ISignal<this, IChangedArgs<IUploadModel | null>>;
    /**
     * Create an iterator over the status of all in progress uploads.
     */
    uploads(): IIterator<IUploadModel>;
    /**
     * Dispose of the resources held by the model.
     */
    dispose(): void;
    /**
     * Create an iterator over the model's items.
     *
     * @returns A new iterator over the model's items.
     */
    items(): IIterator<Contents.IModel>;
    /**
     * Create an iterator over the active sessions in the directory.
     *
     * @returns A new iterator over the model's active sessions.
     */
    sessions(): IIterator<Session.IModel>;
    /**
     * Force a refresh of the directory contents.
     */
    refresh(): Promise<void>;
    /**
     * Change directory.
     *
     * @param path - The path to the file or directory.
     *
     * @returns A promise with the contents of the directory.
     */
    cd(newValue?: string): Promise<void>;
    /**
     * Download a file.
     *
     * @param path - The path of the file to be downloaded.
     *
     * @returns A promise which resolves when the file has begun
     *   downloading.
     */
    download(path: string): Promise<void>;
    /**
     * Restore the state of the file browser.
     *
     * @param id - The unique ID that is used to construct a state database key.
     *
     * @param populate - If `false`, the restoration ID will be set but the file
     * browser state will not be fetched from the state database.
     *
     * @returns A promise when restoration is complete.
     *
     * #### Notes
     * This function will only restore the model *once*. If it is called multiple
     * times, all subsequent invocations are no-ops.
     */
    restore(id: string, populate?: boolean): Promise<void>;
    /**
     * Upload a `File` object.
     *
     * @param file - The `File` object to upload.
     *
     * @returns A promise containing the new file contents model.
     *
     * #### Notes
     * On Notebook version < 5.1.0, this will fail to upload files that are too
     * big to be sent in one request to the server. On newer versions, or on
     * Jupyter Server, it will ask for confirmation then upload the file in 1 MB
     * chunks.
     */
    upload(file: File): Promise<Contents.IModel>;
    private _shouldUploadLarge;
    /**
     * Perform the actual upload.
     */
    private _upload;
    private _uploadCheckDisposed;
    /**
     * Handle an updated contents model.
     */
    protected handleContents(contents: Contents.IModel): void;
    /**
     * Handle a change to the running sessions.
     */
    protected onRunningChanged(sender: Session.IManager, models: IterableOrArrayLike<Session.IModel>): void;
    /**
     * Handle a change on the contents manager.
     */
    protected onFileChanged(sender: Contents.IManager, change: Contents.IChangedArgs): void;
    /**
     * Populate the model's sessions collection.
     */
    private _populateSessions;
    protected translator: ITranslator;
    private _trans;
    private _connectionFailure;
    private _fileChanged;
    private _items;
    private _key;
    private _model;
    private _pathChanged;
    private _paths;
    private _pending;
    private _pendingPath;
    private _refreshed;
    private _sessions;
    private _state;
    private _driveName;
    private _isDisposed;
    private _restored;
    private _uploads;
    private _uploadChanged;
    private _unloadEventListener;
    private _poll;
}
/**
 * The namespace for the `FileBrowserModel` class statics.
 */
export declare namespace FileBrowserModel {
    /**
     * An options object for initializing a file browser.
     */
    interface IOptions {
        /**
         * Whether a file browser automatically loads its initial path.
         * The default is `true`.
         */
        auto?: boolean;
        /**
         * An optional `Contents.IDrive` name for the model.
         * If given, the model will prepend `driveName:` to
         * all paths used in file operations.
         */
        driveName?: string;
        /**
         * A document manager instance.
         */
        manager: IDocumentManager;
        /**
         * The time interval for browser refreshing, in ms.
         */
        refreshInterval?: number;
        /**
         * An optional state database. If provided, the model will restore which
         * folder was last opened when it is restored.
         */
        state?: IStateDB;
        /**
         * The application language translator.
         */
        translator?: ITranslator;
    }
}
/**
 * File browser model where hidden files inclusion can be toggled on/off.
 */
export declare class TogglableHiddenFileBrowserModel extends FileBrowserModel {
    constructor(options: TogglableHiddenFileBrowserModel.IOptions);
    /**
     * Create an iterator over the model's items filtering hidden files out if necessary.
     *
     * @returns A new iterator over the model's items.
     */
    items(): IIterator<Contents.IModel>;
    /**
     * Set the inclusion of hidden files. Triggers a model refresh.
     */
    showHiddenFiles(value: boolean): void;
    private _includeHiddenFiles;
}
/**
 * Namespace for the togglable hidden file browser model
 */
export declare namespace TogglableHiddenFileBrowserModel {
    /**
     * Constructor options
     */
    interface IOptions extends FileBrowserModel.IOptions {
        /**
         * Whether hidden files should be included in the items.
         */
        includeHiddenFiles?: boolean;
    }
}
/**
 * File browser model with optional filter on element.
 */
export declare class FilterFileBrowserModel extends TogglableHiddenFileBrowserModel {
    constructor(options: FilterFileBrowserModel.IOptions);
    /**
     * Create an iterator over the filtered model's items.
     *
     * @returns A new iterator over the model's items.
     */
    items(): IIterator<Contents.IModel>;
    setFilter(filter: (value: Contents.IModel) => boolean | Partial<IScore> | null): void;
    private _filter;
}
/**
 * Namespace for the filtered file browser model
 */
export declare namespace FilterFileBrowserModel {
    /**
     * Constructor options
     */
    interface IOptions extends TogglableHiddenFileBrowserModel.IOptions {
        /**
         * Filter function on file browser item model
         */
        filter?: (value: Contents.IModel) => boolean | Partial<IScore> | null;
    }
}
