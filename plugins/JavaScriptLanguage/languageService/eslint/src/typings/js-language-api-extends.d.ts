/**
 * NodeJS require function
 */
declare var require: {
    (id: string): any;
    resolve(id: string): string;
    cache: any;
    extensions: any;
    main: any;
};

interface PluginState {
    readonly eslintPackagePath: string;
    readonly additionalRootDirectory?: string;
    readonly filterSource: boolean | null;
}

interface ESLintRequest {
    /**
     * Unique id of the message
     */
    readonly seq: number;

    /**
     * Message type (usually it is "request")
     */
    readonly type: string;

    /**
     * Id of the command
     */
    readonly command: string;

    /**
     * Additional arguments
     */
    readonly arguments?: any;
}

interface GetErrorsArguments {
    /**
     * .eslintignore file path
     */
    readonly ignoreFilePath: string;
    /**
     * Absolute path for the file to check
     */
    readonly fileName: string;

    /**
     * Absolute config path
     */
    readonly configPath: string;

    /**
     * Content of the file
     */
    readonly content: string;
    readonly extraOptions: string | null;
}

interface FixErrorsArguments {
    /**
     * .eslintignore file path
     */
    readonly ignoreFilePath: string;
    /**
     * Absolute path for the file to check
     */
    readonly fileName: string;

    /**
     * Absolute config path
     */
    readonly configPath: string;
    readonly extraOptions: string | null;
}