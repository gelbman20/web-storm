var MESSAGE_PREFIX = '##teamcity[';

function inherit(child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}


function Tree(idPrefix, write) {
  this.idPrefix = idPrefix;
  /**
   * @type {Function}
   * @protected
   */
  this.writeln = function (str) {
    write(str + '\n');
  };
  /**
   * Invisible root. No messages should be sent to IDE for this node.
   * @type {TestSuiteNode}
   * @public
   */
  this.root = new TestSuiteNode(this, 0, null, 'hidden root', null, null);
  /**
   * @type {number}
   * @protected
   */
  this.nextId = 1;
}

Tree.prototype.startNotify = function() {
  this.writeln('##teamcity[enteredTheMatrix]');
};

Tree.prototype.updateRootNode = function(name, comment, location) {
  var str = MESSAGE_PREFIX + 'rootName name=\'' + escapeAttributeValue(name);
  if (isString(comment)) {
    str += '\' comment=\'' + escapeAttributeValue(comment);
  }
  if (isString(location)) {
    str += '\' location=\'' + escapeAttributeValue(location);
  }
  str += '\']';
  this.writeln(str);
};

Tree.prototype.addTotalTestCount = function (totalTestCount) {
  if (typeof totalTestCount === 'number' && totalTestCount > 0) {
    this.writeln('##teamcity[testCount count=\'' + totalTestCount + '\']');
  }
};

Tree.prototype.testingStarted = function () {
  this.writeln('##teamcity[testingStarted]');
};

Tree.prototype.testingFinished = function () {
  this.writeln('##teamcity[testingFinished]');
};

/**
 * Node class is a base abstract class for TestSuiteNode and TestNode classes.
 *
 * @param {Tree} tree test tree
 * @param {number} id this node ID. It should be unique among all node IDs that belong to the same tree.
 * @param {TestSuiteNode} parent parent node
 * @param {string} name node name (it could be a suite/spec name)
 * @param {string} type node type (e.g. 'config', 'browser')
 * @param {string} locationPath string that is used by IDE to navigate to the definition of the node
 * @abstract
 * @constructor
 */
function Node(tree, id, parent, name, type, locationPath) {
  /**
   * @type {Tree}
   * @public
   */
  this.tree = tree;
  /**
   * @type {number}
   * @protected
   */
  this.id = id;
  /**
   * @type {TestSuiteNode}
   * @public
   */
  this.parent = parent;
  /**
   * @type {string}
   * @public
   */
  this.name = name;
  /**
   * @type {?string}
   * @private
   */
  this.type = type;
  /**
   * @type {?string}
   * @private
   */
  this.locationPath = locationPath;
  /**
   * @type {NodeState}
   * @protected
   */
  this.state = NodeState.CREATED;
}

/**
 * @param name
 * @constructor
 * @private
 */
function NodeState(name) {
  this.name = name;
}
NodeState.prototype.toString = function() {
    return this.name;
};
NodeState.CREATED = new NodeState('created');
NodeState.REGISTERED = new NodeState('registered');
NodeState.STARTED = new NodeState('started');
NodeState.FINISHED = new NodeState('finished');

/**
 * Changes node's state to 'REGISTERED' and sends corresponding message to IDE.
 * In response to this message IDE will add a node with 'non-spinning' icon to its test tree.
 * @public
 */
Node.prototype.register = function () {
  var text = this.getRegisterMessage();
  this.tree.writeln(text);
  this.state = NodeState.REGISTERED;
};

/**
 * @returns {string}
 * @private
 */
Node.prototype.getRegisterMessage = function () {
  if (this.state === NodeState.CREATED) {
    return this.getInitMessage(false);
  }
  throw Error('Unexpected node state: ' + this.state);
};

/**
 * @param {boolean} running
 * @returns {string}
 * @private
 */
Node.prototype.getInitMessage = function (running) {
  var startCommandName = this.getStartCommandName();
  var text = '##teamcity[';
  text += startCommandName;
  text += ' nodeId=\'' + this.id;
  var parentId = this.parent ? this.parent.id : 0;
  text += '\' parentNodeId=\'' + parentId;
  text += '\' name=\'' + escapeAttributeValue(this.name);
  text += '\' running=\'' + running;
  if (this.type != null) {
    text += '\' nodeType=\'' + this.type;
    if (this.locationPath != null) {
      text += '\' locationHint=\'' + escapeAttributeValue(this.type + '://' + this.locationPath);
    }
  }
  if (isString(this.metainfo)) {
    text += '\' metainfo=\'' + escapeAttributeValue(this.metainfo);
  }
  text += '\']';
  return text;
};

/**
 * Changes node's state to 'STARTED' and sends a corresponding message to IDE.
 * In response to this message IDE will do either of:
 * - if IDE test tree doesn't have a node, the node will be added with 'spinning' icon
 * - if IDE test tree has a node, the node's icon will be changed to 'spinning' one
 * @public
 */
Node.prototype.start = function () {
  if (this.state === NodeState.FINISHED) {
    throw Error("Cannot start finished node");
  }
  if (this.state === NodeState.STARTED) {
    // do nothing in case of starting already started node
    return;
  }
  var text = this.getStartMessage();
  this.tree.writeln(text);
  this.state = NodeState.STARTED;
};

/**
 * @returns {String}
 * @private
 */
Node.prototype.getStartMessage = function () {
  if (this.state === NodeState.CREATED) {
    return this.getInitMessage(true);
  }
  if (this.state === NodeState.REGISTERED) {
    var commandName = this.getStartCommandName();
    return '##teamcity[' + commandName + ' nodeId=\'' + this.id + '\' running=\'true\']';
  }
  throw Error("Unexpected node state: " + this.state);
};

/**
 * @return {string}
 * @abstract
 * @private
 */
Node.prototype.getStartCommandName = function () {
  throw Error('Must be implemented by subclasses');
};

/**
 * Changes node's state to 'FINISHED' and sends corresponding message to IDE.
 * @param {boolean?} finishParentIfLast if true, parent node will be finished if all sibling nodes have already been finished
 * @public
 */
Node.prototype.finish = function (finishParentIfLast) {
  if (this.tree.root === this) {
    return;
  }
  if (this.state !== NodeState.REGISTERED && this.state !== NodeState.STARTED) {
    throw Error('Unexpected node state: ' + this.state);
  }
  var text = this.getFinishMessage();
  this.tree.writeln(text);
  this.state = NodeState.FINISHED;
  if (finishParentIfLast) {
    var parent = this.parent;
    if (parent != null && parent != this.tree.root) {
      parent.onChildFinished();
    }
  }
};

/**
 * @returns {boolean} if this node has been finished
 */
Node.prototype.isFinished = function () {
  return this.state === NodeState.FINISHED;
};

/**
 * @returns {string}
 * @private
 */
Node.prototype.getFinishMessage = function () {
  var text = '##teamcity[' + this.getFinishCommandName();
  text += ' nodeId=\'' + this.id + '\'';
  var extraParameters = this.getExtraFinishMessageParameters();
  if (extraParameters) {
    text += extraParameters;
  }
  text += ']';
  return text;
};

/**
 * @returns {string}
 * @abstract
 * @private
 */
Node.prototype.getExtraFinishMessageParameters = function () {
  throw Error('Must be implemented by subclasses');
};

Node.prototype.finishIfStarted = function () {
  if (this.state !== NodeState.FINISHED) {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].finishIfStarted();
    }
    this.finish();
  }
};

/**
 * TestSuiteNode child of Node class. Represents a non-leaf node without state (its state is computed by its child states).
 *
 * @param {Tree} tree test tree
 * @param {number} id this node's ID. It should be unique among all node IDs that belong to the same tree.
 * @param {TestSuiteNode} parent parent node
 * @param {String} name node name (e.g. config file name / browser name / suite name)
 * @param {String} type node type (e.g. 'config', 'browser')
 * @param {String} locationPath navigation info
 * @constructor
 * @extends Node
 */
function TestSuiteNode(tree, id, parent, name, type, locationPath) {
  Node.call(this, tree, id, parent, name, type, locationPath);
  /**
   * @type {Array}
   * @public
   */
  this.children = [];
  /**
   * @type {Object}
   * @private
   */
  this.lookupMap = {};
  /**
   * @type {number}
   * @private
   */
  this.finishedChildCount = 0;
}

inherit(TestSuiteNode, Node);

/**
 * Returns child node by its name.
 * @param childName
 * @returns {?Node} child node (null, if no child node with such name found)
 */
TestSuiteNode.prototype.findChildNodeByName = function(childName) {
  var result = getChildrenByName(this, childName);
  if (Array.isArray(result)) {
    // prefer suite node
    var suite = result.find(function (child) {
      return child instanceof TestSuiteNode;
    });
    return suite ? suite : result[0];
  }
  return result;
};

/**
 * @static
 */
function getChildrenByName(parentNode, childName) {
  if (Object.prototype.hasOwnProperty.call(parentNode.lookupMap, childName)) {
    return parentNode.lookupMap[childName];
  }
  return null;
}

/**
 * @static
 */
function addChildNode(parentNode, childNode) {
  var childName = childNode.name;
  var children = getChildrenByName(parentNode, childName);
  if (children) {
    if (!Array.isArray(children)) {
      children = [children];
      parentNode.lookupMap[childName] = children;
    }
    children.push(childNode);
  }
  else {
    parentNode.lookupMap[childName] = childNode;
  }
}

/**
 * @returns {string}
 * @private
 */
TestSuiteNode.prototype.getStartCommandName = function () {
  return 'testSuiteStarted';
};

/**
 * @returns {string}
 * @private
 */
TestSuiteNode.prototype.getFinishCommandName = function () {
  return 'testSuiteFinished';
};

/**
 * @returns {?string}
 * @private
 */
TestSuiteNode.prototype.getExtraFinishMessageParameters = function () {
  return null;
};

/**
 * Adds a new test child.
 * @param {string} childName node name (e.g. browser name / suite name / spec name)
 * @param {string} nodeType child node type (e.g. 'config', 'browser')
 * @param {string} locationPath navigation info
 * @returns {TestNode}
 */
TestSuiteNode.prototype.addTestChild = function (childName, nodeType, locationPath) {
  if (this.state === NodeState.FINISHED) {
    throw Error('Child node cannot be created for finished nodes!');
  }
  var childId = this.tree.nextId++;
  if (this.tree.idPrefix != null) {
    childId = this.tree.idPrefix + '-' + childId;
  }
  var child = new TestNode(this.tree, childId, this, childName, nodeType, locationPath);
  this.children.push(child);
  addChildNode(this, child);
  return child;
};

/**
 * Adds a new child for this suite node.
 * @param {String} childName node name (e.g. browser name / suite name / spec name)
 * @param {String} nodeType child node type (e.g. 'config', 'browser')
 * @param {String} locationPath navigation info
 * @returns {TestSuiteNode}
 */
TestSuiteNode.prototype.addTestSuiteChild = function (childName, nodeType, locationPath) {
  if (this.state === NodeState.FINISHED) {
    throw Error('Child node cannot be created for finished nodes!');
  }
  var childId = this.tree.nextId++;
  if (this.tree.idPrefix != null) {
    childId = this.tree.idPrefix + '-' + childId;
  }
  var child = new TestSuiteNode(this.tree, childId, this, childName, nodeType, locationPath);
  this.children.push(child);
  addChildNode(this, child);
  return child;
};

/**
 * @protected
 */
TestSuiteNode.prototype.onChildFinished = function() {
  this.finishedChildCount++;
  if (this.finishedChildCount === this.children.length) {
    if (this.state !== NodeState.FINISHED) {
      this.finish(true);
    }
  }
};

/**
 * TestNode class that represents a test node.
 *
 * @param {Tree} tree test tree
 * @param {number} id this node ID. It should be unique among all node IDs that belong to the same tree.
 * @param {TestSuiteNode} parent parent node
 * @param {string} name node name (spec name)
 * @param {string} type node type (e.g. 'config', 'browser')
 * @param {string} locationPath navigation info
 * @constructor
 */
function TestNode(tree, id, parent, name, type, locationPath) {
  Node.call(this, tree, id, parent, name, type, locationPath);
  /**
   * @type {TestOutcome}
   * @private
   */
  this.outcome = undefined;
  /**
   * @type {number}
   * @private
   */
  this.durationMillis = undefined;
  /**
   * @type {string}
   * @private
   */
  this.failureMsg = undefined;
  /**
   * @type {string}
   * @private
   */
  this.failureDetails = undefined;
  /**
   * @type {string}
   * @private
   */
  this.expectedStr = undefined;
  /**
   * @type {string}
   * @private
   */
  this.actualStr = undefined;
  /**
   * @type {string}
   * @private
   */
  this.expectedFilePath = undefined;
  /**
   * @type {string}
   * @private
   */
  this.actualFilePath = undefined;
  /**
   * @type {string}
   * @private
   */
  this.metainfo = undefined;
}

inherit(TestNode, Node);

/**
 * @param name
 * @constructor
 * @private
 */
function TestOutcome(name) {
  this.name = name;
}
TestOutcome.prototype.toString = function () {
    return this.name;
};

TestOutcome.SUCCESS = new TestOutcome("success");
TestOutcome.SKIPPED = new TestOutcome("skipped");
TestOutcome.FAILED = new TestOutcome("failed");
TestOutcome.ERROR = new TestOutcome("error");

Tree.TestOutcome = TestOutcome;

/**
 * @param {TestOutcome} outcome test outcome
 * @param {number|null} durationMillis test duration is ms
 * @param {string|null} failureMsg
 * @param {string|null} failureDetails
 * @param {string|null} expectedStr
 * @param {string|null} actualStr
 * @param {string|null} expectedFilePath
 * @param {string|null} actualFilePath
 * @public
 */
TestNode.prototype.setOutcome = function (outcome, durationMillis, failureMsg, failureDetails,
                                          expectedStr, actualStr,
                                          expectedFilePath, actualFilePath) {
  if (this.outcome != null) {
    throw Error("Test outcome has already been set!");
  }
  this.outcome = outcome;
  this.durationMillis = durationMillis;
  this.failureMsg = failureMsg;
  this.failureDetails = failureDetails;
  this.expectedStr = isString(expectedStr) ? expectedStr : null;
  this.actualStr = isString(actualStr) ? actualStr : null;
  this.expectedFilePath = isString(expectedFilePath) ? expectedFilePath : null;
  this.actualFilePath = isString(actualFilePath) ? actualFilePath : null;
  if (outcome === TestOutcome.SKIPPED && !failureMsg) {
    this.failureMsg = 'Pending test \'' + this.name + '\'';
  }
};

TestNode.prototype.setMetainfo = function (metainfo) {
  this.metainfo = metainfo;
};

/**
 * @returns {string}
 * @private
 */
TestNode.prototype.getStartCommandName = function () {
  return 'testStarted';
};

/**
 * @returns {string}
 * @private
 */
TestNode.prototype.getFinishCommandName = function () {
  switch (this.outcome) {
    case TestOutcome.SUCCESS:
      return 'testFinished';
    case TestOutcome.SKIPPED:
      return 'testIgnored';
    case TestOutcome.FAILED:
      return 'testFailed';
    case TestOutcome.ERROR:
      return 'testFailed';
    default:
      throw Error('Unexpected outcome: ' + this.outcome);
  }
};

/**
 *
 * @returns {string}
 * @private
 */
TestNode.prototype.getExtraFinishMessageParameters = function () {
  var params = '';
  if (typeof this.durationMillis === 'number') {
    params += ' duration=\'' + this.durationMillis + '\'';
  }
  if (this.outcome === TestOutcome.ERROR) {
    params += ' error=\'yes\'';
  }
  if (isString(this.failureMsg)) {
    params += ' message=\'' + escapeAttributeValue(this.failureMsg) + '\'';
  }
  if (isString(this.failureDetails)) {
    params += ' details=\'' + escapeAttributeValue(this.failureDetails) + '\'';
  }
  if (isString(this.expectedStr)) {
    params += ' expected=\'' + escapeAttributeValue(this.expectedStr) + '\'';
  }
  if (isString(this.actualStr)) {
    params += ' actual=\'' + escapeAttributeValue(this.actualStr) + '\'';
  }
  if (isString(this.expectedFilePath)) {
    params += ' expectedFile=\'' + escapeAttributeValue(this.expectedFilePath) + '\'';
  }
  if (isString(this.actualFilePath)) {
    params += ' actualFile=\'' + escapeAttributeValue(this.actualFilePath) + '\'';
  }
  return params.length === 0 ? null : params;
};

/**
 * @param {string} err
 */
TestNode.prototype.addStdErr = function (err) {
  if (isString(err)) {
    var text = '##teamcity[testStdErr nodeId=\'' + this.id
      + '\' out=\'' + escapeAttributeValue(err) + '\']';
    this.tree.writeln(text);
  }
};

var doEscapeCharCode = (function () {
  var obj = {};

  function addMapping(fromChar, toChar) {
    if (fromChar.length !== 1 || toChar.length !== 1) {
      throw Error('String length should be 1');
    }
    var fromCharCode = fromChar.charCodeAt(0);
    if (typeof obj[fromCharCode] === 'undefined') {
      obj[fromCharCode] = toChar;
    }
    else {
      throw Error('Bad mapping');
    }
  }

  addMapping('\n', 'n');
  addMapping('\r', 'r');
  addMapping('\u0085', 'x');
  addMapping('\u2028', 'l');
  addMapping('\u2029', 'p');
  addMapping('|', '|');
  addMapping('\'', '\'');
  addMapping('[', '[');
  addMapping(']', ']');

  return function (charCode) {
    return obj[charCode];
  };
}());

function isAttributeValueEscapingNeeded(str) {
  var len = str.length;
  for (var i = 0; i < len; i++) {
    if (doEscapeCharCode(str.charCodeAt(i))) {
      return true;
    }
  }
  return false;
}

function escapeAttributeValue(str) {
  if (!isAttributeValueEscapingNeeded(str)) {
    return str;
  }
  var res = ''
    , len = str.length;
  for (var i = 0; i < len; i++) {
    var escaped = doEscapeCharCode(str.charCodeAt(i));
    if (escaped) {
      res += '|';
      res += escaped;
    }
    else {
      res += str.charAt(i);
    }
  }
  return res;
}

var toString = {}.toString;

/**
 * @param {*} value
 * @return {boolean}
 */
function isString(value) {
  return typeof value === 'string' || toString.call(value) === '[object String]';
}

module.exports = Tree;
