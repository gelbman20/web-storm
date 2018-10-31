"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ESLintCommands;
(function (ESLintCommands) {
    ESLintCommands.GetErrors = "GetErrors";
    ESLintCommands.FixErrors = "FixErrors";
})(ESLintCommands || (ESLintCommands = {}));
var ESLintResponse = /** @class */ (function () {
    function ESLintResponse() {
    }
    return ESLintResponse;
}());
var ESLintPlugin = /** @class */ (function () {
    function ESLintPlugin(state) {
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
    ESLintPlugin.prototype.onMessage = function (p, writer) {
        var request = JSON.parse(p);
        var response = new ESLintResponse();
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
                var body = void 0;
                if (request.command === ESLintCommands.GetErrors) {
                    body = this.getErrors(request.arguments);
                }
                else if (request.command === ESLintCommands.FixErrors) {
                    body = this.fixErrors(request.arguments);
                }
                if (this.filterSource == null || this.filterSource) {
                    ESLintPlugin.filterSourceOut(body);
                }
                response.body = body;
            }
        }
        catch (e) {
            response.error = e.toString() + "\n\n" + e.stack;
        }
        finally {
            writer.write(JSON.stringify(response));
        }
    };
    ESLintPlugin.filterSourceOut = function (body) {
        for (var i = 0; i < body.length; i++) {
            var elem = body[i];
            if (elem != null) {
                if (elem.source != null)
                    elem.source = "";
                if (elem.messages != null) {
                    for (var j = 0; j < elem.messages.length; j++) {
                        var message = elem.messages[j];
                        if (message.source != null)
                            message.source = "";
                    }
                }
            }
        }
    };
    ESLintPlugin.prototype.getErrors = function (getErrorsArguments) {
        var args = this.createArguments(getErrorsArguments);
        var parsedOptions = this.options.parse(args);
        parsedOptions.ignorePath = getErrorsArguments.ignoreFilePath;
        parsedOptions.ignore = parsedOptions.ignorePath != null;
        var cliEngine = new this.CliEngine(ESLintPlugin.translateOptions(parsedOptions));
        if (cliEngine.isPathIgnored(getErrorsArguments.fileName))
            return [];
        var report = cliEngine.executeOnText(getErrorsArguments.content, getErrorsArguments.fileName, true);
        return ESLintPlugin.formatResults(report, cliEngine, parsedOptions);
    };
    ESLintPlugin.formatResults = function (report, cliEngine, parsedOptions) {
        var output = cliEngine.getFormatter(parsedOptions.format)(report.results);
        // todo: too many warnings count
        return JSON.parse(output);
    };
    ESLintPlugin.prototype.fixErrors = function (fixErrorsArguments) {
        var args = this.createArguments(fixErrorsArguments);
        args += " --fix \"" + fixErrorsArguments.fileName + "\"";
        var parsedOptions = this.options.parse(args);
        parsedOptions.ignorePath = fixErrorsArguments.ignoreFilePath;
        parsedOptions.ignore = parsedOptions.ignorePath != null;
        var cliEngine = new this.CliEngine(ESLintPlugin.translateOptions(parsedOptions));
        if (cliEngine.isPathIgnored(fixErrorsArguments.fileName))
            return [];
        var report = cliEngine.executeOnFiles(parsedOptions._);
        this.CliEngine.outputFixes(report);
        return ESLintPlugin.formatResults(report, cliEngine, parsedOptions);
    };
    ESLintPlugin.prototype.createArguments = function (getErrorsArguments) {
        var args = "";
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
    };
    ESLintPlugin.prototype.calcBasicPath = function (eslintPackagePath) {
        if (eslintPackagePath.charAt(eslintPackagePath.length - 1) !== '/' &&
            eslintPackagePath.charAt(eslintPackagePath.length - 1) !== '\\') {
            eslintPackagePath = eslintPackagePath + '/';
        }
        eslintPackagePath = eslintPackagePath.split("\\").join("/");
        this.basicPath = eslintPackagePath;
    };
    ESLintPlugin.prototype.readVersion = function () {
        var fs = require("fs");
        var packageJsonPath = this.basicPath + "/package.json";
        if (!fs.existsSync(packageJsonPath)) {
            this.initError = "Can not find package.json under '" + this.basicPath + "'";
            return null;
        }
        var contents = fs.readFileSync(packageJsonPath);
        try {
            var json = JSON.parse(contents);
            return json["version"];
        }
        catch (e) {
            this.initError = "Can not parse '" + packageJsonPath + "':\n" + e.toString() + "\n\n" + e.stack;
        }
        return null;
    };
    // taken from privtae part of eslint, we need it here
    /**
     * Translates the CLI options into the options expected by the CLIEngine.
     * @param {Object} cliOptions The CLI options to translate.
     * @returns {CLIEngineOptions} The options object for the CLIEngine.
     * @private
     */
    ESLintPlugin.translateOptions = function (cliOptions) {
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
    };
    return ESLintPlugin;
}());
exports.ESLintPlugin = ESLintPlugin;
