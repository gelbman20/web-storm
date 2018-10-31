namespace ESLintCommands {
    export let GetErrors: string = "GetErrors";
    export let FixErrors: string = "FixErrors";
}

class ESLintResponse {
    request_seq: number;
    command: string;
    version: string;
    body: string;
    error: string;
}

export class ESLintPlugin implements LanguagePlugin {
    private readonly filterSource: boolean | null;
    private readonly additionalRulesDirectory?: string;
    private linter?: any;
    private options?: any;
    private CliEngine?: any;
    private readonly version: string | null;
    private basicPath: string;
    private initError: string;

    constructor(state: PluginState) {
        this.filterSource = state.filterSource;
        this.additionalRulesDirectory = state.additionalRootDirectory;
        this.calcBasicPath(state.eslintPackagePath);
        this.version = this.readVersion();
        if (this.initError == null) {
            this.linter = require(this.basicPath + "lib/cli.js");
            this.options = require(this.basicPath + "lib/options");
            this.CliEngine = require(this.basicPath + "lib/cli-engine");
        }
    }

    onMessage(p: string, writer: MessageWriter): void {
        const request: ESLintRequest = JSON.parse(p);
        let response: ESLintResponse = new ESLintResponse();
        response.request_seq = request.seq;
        response.command = request.command;
        response.version = this.version == null ? "" : this.version;
        try {
            if (this.initError != null) {
                response.error = this.initError;
                return;
            }
            if (response.version.lastIndexOf("0.", 0) == 0) {
                response.error = "This ESLint version (" + this.version + ") is not supported. Please upgrade ESLint.";
                return;
            }

            if (this.linter != null && this.options != null && this.CliEngine != null) {
                let body: any;
                if (request.command === ESLintCommands.GetErrors) {
                    body = this.getErrors(request.arguments);
                } else if (request.command === ESLintCommands.FixErrors) {
                    body = this.fixErrors(request.arguments);
                }
                if (this.filterSource == null || this.filterSource) {
                    ESLintPlugin.filterSourceOut(body);
                }
                response.body = body;
            }
        } catch (e) {
            response.error = e.toString() + "\n\n" + e.stack;
        } finally {
            writer.write(JSON.stringify(response));
        }
    }

    private static filterSourceOut(body: any) {
        for (let i = 0; i < body.length; i++) {
            let elem = body[i];
            if (elem != null) {
                if (elem.source != null) elem.source = "";
                if (elem.messages != null) {
                    for (let j = 0; j < elem.messages.length; j++) {
                        let message = elem.messages[j];
                        if (message.source != null) message.source = "";
                    }
                }
            }
        }
    }

    private getErrors(getErrorsArguments: GetErrorsArguments): any {
        let args = this.createArguments(getErrorsArguments);
        const parsedOptions = this.options.parse(args);
        parsedOptions.ignorePath = getErrorsArguments.ignoreFilePath;
        parsedOptions.ignore = parsedOptions.ignorePath != null;
        const cliEngine = new this.CliEngine(ESLintPlugin.translateOptions(parsedOptions));
        if (cliEngine.isPathIgnored(getErrorsArguments.fileName)) return [];
        const report = cliEngine.executeOnText(getErrorsArguments.content, getErrorsArguments.fileName, true);
        return ESLintPlugin.formatResults(report, cliEngine, parsedOptions);
    }

    private static formatResults(report: any, cliEngine: any, parsedOptions: any | number) {
        const output = cliEngine.getFormatter(parsedOptions.format)(report.results);
        // todo: too many warnings count
        return JSON.parse(output);
    }

    private fixErrors(fixErrorsArguments: FixErrorsArguments): any {
        let args = this.createArguments(fixErrorsArguments);
        args += " --fix \"" + fixErrorsArguments.fileName + "\"";
        const parsedOptions = this.options.parse(args);
        parsedOptions.ignorePath = fixErrorsArguments.ignoreFilePath;
        parsedOptions.ignore = parsedOptions.ignorePath != null;
        const cliEngine = new this.CliEngine(ESLintPlugin.translateOptions(parsedOptions));
        if (cliEngine.isPathIgnored(fixErrorsArguments.fileName)) return [];
        const report = cliEngine.executeOnFiles(parsedOptions._);
        this.CliEngine.outputFixes(report);

        return ESLintPlugin.formatResults(report, cliEngine, parsedOptions);
    }

    private createArguments(getErrorsArguments: any) {
        let args = "";
        if (getErrorsArguments.configPath != null) {
            args += "-c \"" + getErrorsArguments.configPath + "\"";
        }
        args += " --format=json ";
        if (getErrorsArguments.extraOptions != null && getErrorsArguments.extraOptions.length > 0) {
            args += " " + getErrorsArguments.extraOptions;
        }
        if (this.additionalRulesDirectory != null && this.additionalRulesDirectory.length > 0) {
            args += " --rulesdir=\"" + this.additionalRulesDirectory + "\"";
        }
        return args;
    }

    private calcBasicPath(eslintPackagePath: string) {
        if (eslintPackagePath.charAt(eslintPackagePath.length - 1) !== '/' &&
            eslintPackagePath.charAt(eslintPackagePath.length - 1) !== '\\') {
            eslintPackagePath = eslintPackagePath + '/';
        }
        eslintPackagePath = eslintPackagePath.split("\\").join("/");
        this.basicPath = eslintPackagePath;
    }

    private readVersion(): string | null {
        const fs = require("fs");
        const packageJsonPath = this.basicPath + "/package.json";
        if (!fs.existsSync(packageJsonPath)) {
            this.initError = "Can not find package.json under '" + this.basicPath + "'";
            return null;
        }
        const contents = fs.readFileSync(packageJsonPath);
        try {
            const json = JSON.parse(contents);
            return json["version"];
        } catch (e) {
            this.initError = "Can not parse '" + packageJsonPath + "':\n" + e.toString() + "\n\n" + e.stack;
        }
        return null;
    }

    // taken from privtae part of eslint, we need it here
    /**
     * Translates the CLI options into the options expected by the CLIEngine.
     * @param {Object} cliOptions The CLI options to translate.
     * @returns {CLIEngineOptions} The options object for the CLIEngine.
     * @private
     */
    private static translateOptions(cliOptions: any): any {
        return {
            envs: cliOptions.env,
            extensions: cliOptions.ext,
            rules: cliOptions.rule,
            plugins: cliOptions.plugin,
            globals: cliOptions.global,
            ignore: cliOptions.ignore,
            ignorePath: cliOptions.ignorePath,
            ignorePattern: cliOptions.ignorePattern,
            configFile: cliOptions.config,
            rulePaths: cliOptions.rulesdir,
            useEslintrc: cliOptions.eslintrc,
            parser: cliOptions.parser,
            parserOptions: cliOptions.parserOptions,
            cache: cliOptions.cache,
            cacheFile: cliOptions.cacheFile,
            cacheLocation: cliOptions.cacheLocation,
            fix: cliOptions.fix,
            allowInlineConfig: cliOptions.inlineConfig
        };
    }
}
