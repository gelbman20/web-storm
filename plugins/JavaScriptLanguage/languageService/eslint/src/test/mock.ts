export class PluginStateMock implements PluginState {
    filterSource: boolean | any;
    private _eslintPackagePath: string;
    private _pluginName: string;
    private _sessionId: string;
    private _extraOptions?: string;
    private _additionalRootDirectory?: string;

    constructor(eslintPackagePath: string, pluginName: string, sessionId: string,
                extraOptions?: string, additionalRootDirectory?: string) {
        this._eslintPackagePath = eslintPackagePath;
        this._pluginName = pluginName;
        this._sessionId = sessionId;
        this._extraOptions = extraOptions;
        this._additionalRootDirectory = additionalRootDirectory;
        this.filterSource = true;
    }


    get eslintPackagePath(): string {
        return this._eslintPackagePath;
    }

    get pluginName(): string {
        return this._pluginName;
    }

    get sessionId(): string {
        return this._sessionId;
    }

    get extraOptions(): any {
        return this._extraOptions;
    }

    get additionalRootDirectory(): any {
        return this._additionalRootDirectory;
    }
}

export class ESLintRequestMock implements ESLintRequest {
    constructor(seq: number, type: string, command: string, args: any) {
        this.seq = seq;
        this.type = type;
        this.command = command;
        this.arguments = args;
    }

    seq: number;
    type: string;
    command: string;
    arguments?: any;
}

export class GetErrorArgumentsMock implements GetErrorsArguments {
    constructor(fileName: string, configPath: string, content: string) {
        this.fileName = fileName;
        this.configPath = configPath;
        this.content = content;
    }

    ignoreFilePath: string | any;
    extraOptions: string | any;
    fileName: string;
    configPath: string;
    content: string;
}

export class FixErrorsMock implements FixErrorsArguments {
    constructor(fileName: string, configPath: string) {
        this.fileName = fileName;
        this.configPath = configPath;
    }

    ignoreFilePath: string | any;
    extraOptions: string | any;
    fileName: string;
    configPath: string;
}

export class MessageWriterMock implements MessageWriter {
    private readonly expected: string;

    constructor(expected: string) {
        this.expected = expected;
    }

    write(answer: string): void {
        if (this.expected !== answer) throw new Error("Expected:\n'" + this.expected + "'\n, but was:\n'" + answer + "'");
        console.log("Answer:" + answer);
    }
}