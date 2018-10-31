const Tree = require('../../base-test-reporter/intellij-tree');
const tree = new Tree(null, getStdoutWrite());
const jestIntellijUtil = require('./jest-intellij-util');

function getStdoutWrite() {
  if (typeof process.stdout._intellijOriginalWrite === 'function') {
    return process.stdout._intellijOriginalWrite;
  }
  return process.stdout.write.bind(process.stdout);
}

tree.startNotify();

let runningTests = {};

function IntellijReporter() {
}

IntellijReporter.prototype.onRunStart = jestIntellijUtil.safeFn(function (results, options) {
  runningTests = {};
  tree.testingStarted();
});

IntellijReporter.prototype.onTestStart = jestIntellijUtil.safeFn(function (test) {
  const testFileNode = jestIntellijUtil.addTestFileNode(tree, test.path);
  runningTests[test.path] = testFileNode;
  testFileNode.register();
  testFileNode.start();
});

IntellijReporter.prototype.onTestResult = jestIntellijUtil.safeFn(function (test, testResult, aggregatedResult) {
  const testFileNode = runningTests[testResult.testFilePath];
  if (testFileNode) {
    jestIntellijUtil.reportTestFileResults(testFileNode, testResult);
  }
  else {
    jestIntellijUtil.warn('No started test for ' + testResult.testFilePath);
  }
  delete runningTests[testResult.testFilePath];
});

IntellijReporter.prototype.onRunComplete = jestIntellijUtil.safeFn(function (contexts, results) {
  tree.testingFinished();
});

module.exports = IntellijReporter;
