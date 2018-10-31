var Tree = require('../../base-test-reporter/intellij-tree')
  , stringifier = require('../../base-test-reporter/intellij-stringifier')
  , util = require('../../base-test-reporter/intellij-util')
  , processStdoutWrite = process.stdout.write.bind(process.stdout)
  , processStderrWrite = process.stderr.write.bind(process.stderr)
  , path = require('path')
  , jestMessageUtil = requireJestPackage('jest-message-util');

function requireJestPackage(requiredJestHelperPkg) {
  var jestPkg = process.argv[1];
  if (!util.isString(jestPkg)) {
    return null;
  }
  jestPkg = jestPkg.replace(/\\/g, '/');
  var ind = jestPkg.lastIndexOf('/node_modules/jest/');
  if (ind < 0) {
    ind = jestPkg.lastIndexOf('/node_modules/jest-cli/');
  }
  if (ind > 0) {
    try {
      return require(jestPkg.substring(0, ind) + '/node_modules/' + requiredJestHelperPkg);
    }
    catch (e) {
    }
  }
  return null;
}

function normalizeFailedExpectation(failedExpectation) {
  var message = failedExpectation.message || '';
  var stack = failedExpectation.stack;
  if (util.isString(message) && util.isString(stack) && stack.indexOf(message) === 0) {
    stack = stack.substring(message.length);
  }
  if (stack && jestMessageUtil && typeof jestMessageUtil.formatStackTrace === 'function') {
    var rootDir = process.env._INTELLIJ_JEST_CONFIG_ROOT_DIR || process.cwd();
    stack = jestMessageUtil.formatStackTrace(stack, {rootDir: rootDir}, getTestPath() || '');
  }
  var expected, actual;
  if (failedExpectation.error && failedExpectation.error.matcherResult) {
    expected = failedExpectation.error.matcherResult.expected;
    actual = failedExpectation.error.matcherResult.actual;
  }
  else {
    expected = failedExpectation.expected;
    actual = failedExpectation.actual;
  }
  return {message: message, stack: stack, expected: expected, actual: actual};
}

(function() {
  var configSetupTestFrameworkScriptFile = process.env._JEST_SETUP_TEST_FRAMEWORK_SCRIPT_FILE_OVERWRITTEN_BY_INTELLIJ;
  if (configSetupTestFrameworkScriptFile) {
    require(configSetupTestFrameworkScriptFile);
  }
})();

var idPrefix = (function() {
  var runCount = parseInt(process.env._INTELLIJ_JEST_RUN_COUNT);
  if (typeof runCount !== 'number' || isNaN(runCount)) {
    runCount = 0;
  }
  process.env._INTELLIJ_JEST_RUN_COUNT = ++runCount;
  return runCount + '-' + process.pid;
})();

function getTestPath() {
  if (Symbol && typeof Symbol.for === 'function') {
    var globalStateKey = Symbol.for('$$jest-matchers-object');
    if (globalStateKey) {
      var globalState = global[globalStateKey];
      if (globalState) {
        var state = globalState.state;
        if (state) {
          return state.testPath;
        }
      }
    }
  }
}

function calcPresentableTestFileName(testPath) {
  return path.basename(testPath);
}

var tree = new Tree(idPrefix, processStdoutWrite);
tree.startNotify();

jasmine.getEnv().addReporter(new JasmineReporter());

/**
 * @constructor
 */
function JasmineReporter() {
  var testPath = getTestPath();
  if (util.isString(testPath) && testPath.length > 0) {
    this.testPath = testPath;
    var testFileNodeName = calcPresentableTestFileName(testPath);
    if (process.env._INTELLIJ_JEST_TEST_RUN_FROM_SINGLE_TEST_FILE) {
      tree.updateRootNode(testFileNodeName, null, 'file://' + testPath);
      this.testFileNode = tree.root;
    }
    else {
      this.testFileNode = tree.root.addTestSuiteChild(testFileNodeName, 'file', testPath);
      this.testFileNode.register();
      this.testFileNode.start();
    }
  }
  else {
    this.testFileNode = tree.root;
  }
  this.currentSuiteNode = this.testFileNode;
  this.nodeById = {};
}

JasmineReporter.prototype.jasmineStarted = safeFn(function (options) {
  tree.addTotalTestCount(options.totalSpecsDefined || 0);
});

/**
 * @param {string} name
 */
JasmineReporter.prototype.getLocationPath = function (name) {
  var names = [name], n = this.currentSuiteNode;
  while (n !== this.testFileNode) {
    names.push(n.name);
    n = n.parent;
  }
  names.push(this.testPath || '');
  names.reverse();
  return util.joinList(names, 0, names.length, '.');
};

JasmineReporter.prototype.suiteStarted = safeFn(function (result) {
  var locationPath = this.getLocationPath(result.description);
  var suiteNode = this.currentSuiteNode.addTestSuiteChild(result.description, 'suite', locationPath);
  suiteNode.start();
  this.currentSuiteNode = suiteNode;
});

JasmineReporter.prototype.suiteDone = safeFn(function (result) {
  var suiteNode = this.currentSuiteNode;
  if (suiteNode == null) {
    return warn('No current suite to finish');
  }
  if (suiteNode.name !== result.description) {
    return warn('Suite name mismatch, actual: ' + suiteNode.name + ', expected: ' + result.description);
  }
  suiteNode.finish(false);
  this.currentSuiteNode = suiteNode.parent;
});

/**
 * @param {jasmine.Result} result
 */
JasmineReporter.prototype.specStarted = safeFn(function (result) {
  var locationPath = this.getLocationPath(result.description);
  var specNode = this.currentSuiteNode.addTestChild(result.description, 'test', locationPath);
  specNode.startTimeMillis = new Date().getTime();
  specNode.start();
  if (this.nodeById[result.id] != null) {
    warn('jasmine error, specStarted with not unique result.id: ' + result.id)
  }
  this.nodeById[result.id] = specNode;
});

/**
 * @param {jasmine.Result} result
 */
JasmineReporter.prototype.specDone = safeFn(function (result) {
  var specNode = this.nodeById[result.id];
  if (specNode == null) {
    return warn('Cannot find specNode by id ' + result.id);
  }
  var durationMillis;
  if (typeof specNode.startTimeMillis === 'number') {
    durationMillis = new Date().getTime() - specNode.startTimeMillis;
  }
  var failureMessage, failureDetails, expectedStr, actualStr;
  if (result.failedExpectations.length > 0) {
    var failedExpectation = result.failedExpectations[0];
    var normalized = normalizeFailedExpectation(failedExpectation);
    failureMessage = normalized.message;
    failureDetails = normalized.stack;
    if (normalized.expected !== normalized.actual) {
      expectedStr = stringifier.stringify(normalized.expected);
      actualStr = stringifier.stringify(normalized.actual);
    }
  }
  var outcome;
  if (result.status === 'passed') {
    outcome = Tree.TestOutcome.SUCCESS;
  }
  else if (result.status === 'pending' || result.status === 'disabled') {
    outcome = Tree.TestOutcome.SKIPPED;
  }
  else {
    outcome = Tree.TestOutcome.FAILED;
  }
  specNode.setOutcome(outcome, durationMillis, failureMessage, failureDetails, expectedStr, actualStr, null, null);
  specNode.finish(false);
});

JasmineReporter.prototype.jasmineDone = safeFn(function () {
  if (this.testFileNode !== tree.root) {
    this.testFileNode.finish(false);
  }
});

function safeFn(fn) {
  return function () {
    try {
      return fn.apply(this, arguments);
    } catch (ex) {
      warn(ex.message + '\n' + ex.stack);
    }
  };
}

function warn(message) {
  var str = 'WARN - IDE integration: ' + message + '\n';
  try {
    processStderrWrite(str);
  }
  catch (ex) {
    try {
      processStdoutWrite(str);
    }
    catch (ex) {
      // do nothing
    }
  }
}
