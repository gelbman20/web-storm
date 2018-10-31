"use strict";
var PluginStateMock = (function () {
    function PluginStateMock(eslintPackagePath, pluginName, sessionId, extraOptions, additionalRootDirectory) {
        this._eslintPackagePath = eslintPackagePath;
        this._pluginName = pluginName;
        this._sessionId = sessionId;
        this._extraOptions = extraOptions;
        this._additionalRootDirectory = additionalRootDirectory;
        this.filterSource = true;
    }
    Object.defineProperty(PluginStateMock.prototype, "eslintPackagePath", {
        get: function () {
            return this._eslintPackagePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PluginStateMock.prototype, "pluginName", {
        get: function () {
            return this._pluginName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PluginStateMock.prototype, "sessionId", {
        get: function () {
            return this._sessionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PluginStateMock.prototype, "extraOptions", {
        get: function () {
            return this._extraOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PluginStateMock.prototype, "additionalRootDirectory", {
        get: function () {
            return this._additionalRootDirectory;
        },
        enumerable: true,
        configurable: true
    });
    return PluginStateMock;
}());
exports.PluginStateMock = PluginStateMock;
var ESLintRequestMock = (function () {
    function ESLintRequestMock(seq, type, command, args) {
        this.seq = seq;
        this.type = type;
        this.command = command;
        this.arguments = args;
    }
    return ESLintRequestMock;
}());
exports.ESLintRequestMock = ESLintRequestMock;
var GetErrorArgumentsMock = (function () {
    function GetErrorArgumentsMock(fileName, configPath, content) {
        this.fileName = fileName;
        this.configPath = configPath;
        this.content = content;
    }
    return GetErrorArgumentsMock;
}());
exports.GetErrorArgumentsMock = GetErrorArgumentsMock;
var FixErrorsMock = (function () {
    function FixErrorsMock(fileName, configPath) {
        this.fileName = fileName;
        this.configPath = configPath;
    }
    return FixErrorsMock;
}());
exports.FixErrorsMock = FixErrorsMock;
var MessageWriterMock = (function () {
    function MessageWriterMock(expected) {
        this.expected = expected;
    }
    MessageWriterMock.prototype.write = function (answer) {
        if (this.expected !== answer)
            throw new Error("Expected:\n'" + this.expected + "'\n, but was:\n'" + answer + "'");
        console.log("Answer:" + answer);
    };
    return MessageWriterMock;
}());
exports.MessageWriterMock = MessageWriterMock;
