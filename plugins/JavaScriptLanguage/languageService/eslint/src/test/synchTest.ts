/// <reference path="C:\id\config\webstorm\javascript\extLibs\http_github.com_DefinitelyTyped_DefinitelyTyped_raw_master_mocha_index.d.ts" />
import {factory} from "../eslint-plugin-provider";
import {ESLintRequestMock, FixErrorsMock, GetErrorArgumentsMock, MessageWriterMock, PluginStateMock} from "./mock";

describe('Simple', function() {
    let plugin: LanguagePlugin;

    describe("json", () => {
        it ('should lint the file and return json output', () => {
            plugin = factory.create(new PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new GetErrorArgumentsMock("longLine.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json",
                "function funWithALongNamePleaseReport(){}");
            const requestMock = new ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            const expected = "{\"request_seq\":54321,\"version\":\"3.14.1\",\"command\":\"GetErrors\",\"body\":" +
                "[{\"filePath\":\"C:\\\\id\\\\plugins\\\\JavaScriptLanguage\\\\src\\\\languageService\\\\eslint\\\\longLine.js\",\"messages\":[{\"ruleId\":\"max-len\",\"severity\":2,\"message\":\"Line 1 exceeds the maximum line length of 5.\",\"line\":1,\"column\":1,\"nodeType\":\"Program\",\"source\":\"function funWithALongNamePleaseReport(){}\"}],\"errorCount\":1,\"warningCount\":0,\"source\":\"function funWithALongNamePleaseReport(){}\"}]}";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );

    describe("warn", () => {
        it ('should lint the file and mark errors and warnings', () => {
            plugin = factory.create(new PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new GetErrorArgumentsMock("longLine.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.warn.json",
                "function me() {\nconsole.log('русские буквы');\ndebugger;\n}");
            const requestMock = new ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            const expected = "{\"request_seq\":54321,\"version\":\"3.14.1\",\"command\":\"GetErrors\",\"body\":" +
                "[{\"filePath\":\"C:\\\\id\\\\plugins\\\\JavaScriptLanguage\\\\src\\\\languageService\\\\eslint\\\\longLine.js\",\"messages\":[{\"ruleId\":\"max-len\",\"severity\":2,\"message\":\"Line 1 exceeds the maximum line length of 5.\",\"line\":1,\"column\":1,\"nodeType\":\"Program\",\"source\":\"function funWithALongNamePleaseReport(){}\"}],\"errorCount\":1,\"warningCount\":0,\"source\":\"function funWithALongNamePleaseReport(){}\"}]}";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );

    describe("fix", () => {
        it ('should fix the file', () => {
            plugin = factory.create(new PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new FixErrorsMock("C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\withConsole.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.no.console.json");
            const requestMock = new ESLintRequestMock(54321, "request", "FixErrors", argumentsMock);
            const expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );

    describe("bad config", () => {
        it ('should lint the file and return global error', () => {
            plugin = factory.create(new PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new GetErrorArgumentsMock("longLine.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.bad.json",
                "function funWithALongNamePleaseReport(){}");
            const requestMock = new ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            const expected = "{\"request_seq\":54321,\"version\":\"3.14.1\",\"command\":\"GetErrors\",\"error\":\"SyntaxError: Cannot read config file: D:\\\\git\\\\eslint-idea\\\\testData\\\\.eslintrc.bad.json\\nError: Unexpected end of JSON input\"}";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );

    describe("babel", () => {
        it ('should warn that babel plugin is not installed', () => {
            plugin = factory.create(new PluginStateMock("D:\\git\\eslint-idea\\node_modules\\eslint",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new GetErrorArgumentsMock("forBabel.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json",
                "class Foo {test() {} test1() {}}");
            const requestMock = new ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            const expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );

    describe("oldVersion", () => {
        it ('should warn that babel plugin is not installed', () => {
            plugin = factory.create(new PluginStateMock("D:\\testProjects\\ESLint\\oldVersion\\node_modules\\eslint",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new GetErrorArgumentsMock("forBabel.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json",
                "class Foo {test() {} test1() {}}");
            const requestMock = new ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            const expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );

    describe("false path", () => {
        it ('should warn that babel plugin is not installed', () => {
            plugin = factory.create(new PluginStateMock("D:\\testProjects\\ESLint\\oldVersion\\node_modules\\eslint3432",
                "eslint", "12345", "--format=json")).languagePlugin;

            const argumentsMock = new GetErrorArgumentsMock("forBabel.js",
                "C:\\id\\plugins\\JavaScriptLanguage\\src\\languageService\\eslint\\src\\testData\\.eslintrc.json",
                "class Foo {test() {} test1() {}}");
            const requestMock = new ESLintRequestMock(54321, "request", "GetErrors", argumentsMock);
            const expected = "";
            plugin.onMessage(JSON.stringify(requestMock), new MessageWriterMock(expected));
        });
        }
    );
  }
);