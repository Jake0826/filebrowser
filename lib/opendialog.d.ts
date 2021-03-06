import { Dialog, IScore } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { Contents } from '@jupyterlab/services';
import { ITranslator } from '@jupyterlab/translation';
/**
 * Namespace for file dialog
 */
export declare namespace FileDialog {
    /**
     * Options for the open directory dialog
     */
    interface IDirectoryOptions extends Partial<Pick<Dialog.IOptions<Promise<Contents.IModel[]>>, Exclude<keyof Dialog.IOptions<Promise<Contents.IModel[]>>, 'body' | 'buttons' | 'defaultButton'>>> {
        /**
         * Document manager
         */
        manager: IDocumentManager;
        /**
         * The application language translator.
         */
        translator?: ITranslator;
    }
    /**
     * Options for the open file dialog
     */
    interface IFileOptions extends IDirectoryOptions {
        /**
         * Filter function on file browser item model
         */
        filter?: (value: Contents.IModel) => boolean | Partial<IScore> | null;
        /**
         * The application language translator.
         */
        translator?: ITranslator;
    }
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
    function getOpenFiles(options: IFileOptions): Promise<Dialog.IResult<Contents.IModel[]>>;
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
    function getExistingDirectory(options: IDirectoryOptions): Promise<Dialog.IResult<Contents.IModel[]>>;
}
