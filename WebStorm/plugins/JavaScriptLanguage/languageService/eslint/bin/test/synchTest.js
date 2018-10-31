"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="C:\id\config\webstorm\javascript\extLibs\http_github.com_DefinitelyTyped_DefinitelyTyped_raw_master_mocha_index.d.ts" />
var eslint_plugin_provider_1 = require("../eslint-plugin-provider");
var mock_1 = require("./mock");
describe('Simple', function () {
    var plugin;
    describe("json", function () {
        it('should lint the file and return json output', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.GetErrorArgumentsMock("longLine.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json", "function funWithALongNamePleaseReport(){}");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            var expected = "{\"request_seq\":54321,\"version\":\"3.14.1\",\"command\":\"GetErrors\",\"body\":" +
                "[{\"filePath\":\"C:\\\\id\\\\plugins\\\\JavaScriptLanguage\\\\src\\\\languageService\\\\eslint\\\\longLine.js\",\"messages\":[{\"ruleId\":\"max-len\",\"severity\":2,\"message\":\"Line 1 exceeds the maximum line length of 5.\",\"line\":1,\"column\":1,\"nodeType\":\"Program\",\"source\":\"function funWithALongNamePleaseReport(){}\"}],\"errorCount\":1,\"warningCount\":0,\"source\":\"function funWithALongNamePleaseReport(){}\"}]}";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
    describe("warn", function () {
        it('should lint the file and mark errors and warnings', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.GetErrorArgumentsMock("longLine.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.warn.json", "function me() {\nconsole.log('русские буквы');\ndebugger;\n}");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            var expected = "{\"request_seq\":54321,\"version\":\"3.14.1\",\"command\":\"GetErrors\",\"body\":" +
                "[{\"filePath\":\"C:\\\\id\\\\plugins\\\\JavaScriptLanguage\\\\src\\\\languageService\\\\eslint\\\\longLine.js\",\"messages\":[{\"ruleId\":\"max-len\",\"severity\":2,\"message\":\"Line 1 exceeds the maximum line length of 5.\",\"line\":1,\"column\":1,\"nodeType\":\"Program\",\"source\":\"function funWithALongNamePleaseReport(){}\"}],\"errorCount\":1,\"warningCount\":0,\"source\":\"function funWithALongNamePleaseReport(){}\"}]}";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
    describe("fix", function () {
        it('should fix the file', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.FixErrorsMock("C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\withConsole.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.no.console.json");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "FixErrors", argumentsMock);
            var expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
    describe("bad config", function () {
        it('should lint the file and return global error', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.GetErrorArgumentsMock("longLine.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.bad.json", "function funWithALongNamePleaseReport(){}");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            var expected = "{\"request_seq\":54321,\"version\":\"3.14.1\",\"command\":\"GetErrors\",\"error\":\"SyntaxError: Cannot read config file: D:\\\\git\\\\eslint-idea\\\\testData\\\\.eslintrc.bad.json\\nError: Unexpected end of JSON input\"}";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
    describe("babel", function () {
        it('should warn that babel plugin is not installed', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.GetErrorArgumentsMock("forBabel.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json", "class Foo {test() {} test1() {}}");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            var expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
    describe("oldVersion", function () {
        it('should warn that babel plugin is not installed', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\testProjects\\ESLint\\oldVersion\\node_modules\\eslint", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.GetErrorArgumentsMock("forBabel.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json", "class Foo {test() {} test1() {}}");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            var expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
    describe("false path", function () {
        it('should warn that babel plugin is not installed', function () {
            plugin = eslint_plugin_provider_1.factory.create(new mock_1.PluginStateMock("D:\\testProjects\\ESLint\\oldVersion\\node_modules\\eslint3432", "eslint", "12345", "--format=json")).languagePlugin;
            var argumentsMock = new mock_1.GetErrorArgumentsMock("forBabel.js", "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json", "class Foo {test() {} test1() {}}");
            var requestMock = new mock_1.ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            var expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new mock_1.MessageWriterMock(expected));
        });
    });
});
