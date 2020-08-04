'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib = require('tslib');
var tsInvariant = require('ts-invariant');
var Observable = _interopDefault(require('zen-observable'));
require('symbol-observable');
require('fast-json-stable-stringify');

function validateOperation(operation) {
    var OPERATION_FIELDS = [
        'query',
        'operationName',
        'variables',
        'extensions',
        'context',
    ];
    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
        var key = _a[_i];
        if (OPERATION_FIELDS.indexOf(key) < 0) {
            throw process.env.NODE_ENV === "production" ? new tsInvariant.InvariantError(43) : new tsInvariant.InvariantError("illegal argument: " + key);
        }
    }
    return operation;
}

function createOperation(starting, operation) {
    var context = tslib.__assign({}, starting);
    var setContext = function (next) {
        if (typeof next === 'function') {
            context = tslib.__assign(tslib.__assign({}, context), next(context));
        }
        else {
            context = tslib.__assign(tslib.__assign({}, context), next);
        }
    };
    var getContext = function () { return (tslib.__assign({}, context)); };
    Object.defineProperty(operation, 'setContext', {
        enumerable: false,
        value: setContext,
    });
    Object.defineProperty(operation, 'getContext', {
        enumerable: false,
        value: getContext,
    });
    return operation;
}

function getOperationName(doc) {
    return (doc.definitions
        .filter(function (definition) {
        return definition.kind === 'OperationDefinition' && definition.name;
    })
        .map(function (x) { return x.name.value; })[0] || null);
}

function transformOperation(operation) {
    var transformedOperation = {
        variables: operation.variables || {},
        extensions: operation.extensions || {},
        operationName: operation.operationName,
        query: operation.query,
    };
    if (!transformedOperation.operationName) {
        transformedOperation.operationName =
            typeof transformedOperation.query !== 'string'
                ? getOperationName(transformedOperation.query) || undefined
                : '';
    }
    return transformedOperation;
}

function passthrough(op, forward) {
    return (forward ? forward(op) : Observable.of());
}
function toLink(handler) {
    return typeof handler === 'function' ? new ApolloLink(handler) : handler;
}
function isTerminating(link) {
    return link.request.length <= 1;
}
var LinkError = (function (_super) {
    tslib.__extends(LinkError, _super);
    function LinkError(message, link) {
        var _this = _super.call(this, message) || this;
        _this.link = link;
        return _this;
    }
    return LinkError;
}(Error));
var ApolloLink = (function () {
    function ApolloLink(request) {
        if (request)
            this.request = request;
    }
    ApolloLink.empty = function () {
        return new ApolloLink(function () { return Observable.of(); });
    };
    ApolloLink.from = function (links) {
        if (links.length === 0)
            return ApolloLink.empty();
        return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
    };
    ApolloLink.split = function (test, left, right) {
        var leftLink = toLink(left);
        var rightLink = toLink(right || new ApolloLink(passthrough));
        if (isTerminating(leftLink) && isTerminating(rightLink)) {
            return new ApolloLink(function (operation) {
                return test(operation)
                    ? leftLink.request(operation) || Observable.of()
                    : rightLink.request(operation) || Observable.of();
            });
        }
        else {
            return new ApolloLink(function (operation, forward) {
                return test(operation)
                    ? leftLink.request(operation, forward) || Observable.of()
                    : rightLink.request(operation, forward) || Observable.of();
            });
        }
    };
    ApolloLink.execute = function (link, operation) {
        return (link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))) || Observable.of());
    };
    ApolloLink.concat = function (first, second) {
        var firstLink = toLink(first);
        if (isTerminating(firstLink)) {
            process.env.NODE_ENV === "production" || tsInvariant.invariant.warn(new LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
            return firstLink;
        }
        var nextLink = toLink(second);
        if (isTerminating(nextLink)) {
            return new ApolloLink(function (operation) {
                return firstLink.request(operation, function (op) { return nextLink.request(op) || Observable.of(); }) || Observable.of();
            });
        }
        else {
            return new ApolloLink(function (operation, forward) {
                return (firstLink.request(operation, function (op) {
                    return nextLink.request(op, forward) || Observable.of();
                }) || Observable.of());
            });
        }
    };
    ApolloLink.prototype.split = function (test, left, right) {
        return this.concat(ApolloLink.split(test, left, right || new ApolloLink(passthrough)));
    };
    ApolloLink.prototype.concat = function (next) {
        return ApolloLink.concat(this, next);
    };
    ApolloLink.prototype.request = function (operation, forward) {
        throw process.env.NODE_ENV === "production" ? new tsInvariant.InvariantError(20) : new tsInvariant.InvariantError('request is not implemented');
    };
    ApolloLink.prototype.onError = function (reason) {
        throw reason;
    };
    ApolloLink.prototype.setOnError = function (fn) {
        this.onError = fn;
        return this;
    };
    return ApolloLink;
}());

var OperationBatcher = (function () {
    function OperationBatcher(_a) {
        var batchInterval = _a.batchInterval, batchMax = _a.batchMax, batchHandler = _a.batchHandler, batchKey = _a.batchKey;
        this.queuedRequests = new Map();
        this.batchInterval = batchInterval;
        this.batchMax = batchMax || 0;
        this.batchHandler = batchHandler;
        this.batchKey = batchKey || (function () { return ''; });
    }
    OperationBatcher.prototype.enqueueRequest = function (request) {
        var _this = this;
        var requestCopy = tslib.__assign({}, request);
        var queued = false;
        var key = this.batchKey(request.operation);
        if (!requestCopy.observable) {
            requestCopy.observable = new Observable(function (observer) {
                if (!_this.queuedRequests.has(key)) {
                    _this.queuedRequests.set(key, []);
                }
                if (!queued) {
                    _this.queuedRequests.get(key).push(requestCopy);
                    queued = true;
                }
                requestCopy.next = requestCopy.next || [];
                if (observer.next)
                    requestCopy.next.push(observer.next.bind(observer));
                requestCopy.error = requestCopy.error || [];
                if (observer.error)
                    requestCopy.error.push(observer.error.bind(observer));
                requestCopy.complete = requestCopy.complete || [];
                if (observer.complete)
                    requestCopy.complete.push(observer.complete.bind(observer));
                if (_this.queuedRequests.get(key).length === 1) {
                    _this.scheduleQueueConsumption(key);
                }
                if (_this.queuedRequests.get(key).length === _this.batchMax) {
                    _this.consumeQueue(key);
                }
            });
        }
        return requestCopy.observable;
    };
    OperationBatcher.prototype.consumeQueue = function (key) {
        var requestKey = key || '';
        var queuedRequests = this.queuedRequests.get(requestKey);
        if (!queuedRequests) {
            return;
        }
        this.queuedRequests.delete(requestKey);
        var requests = queuedRequests.map(function (queuedRequest) { return queuedRequest.operation; });
        var forwards = queuedRequests.map(function (queuedRequest) { return queuedRequest.forward; });
        var observables = [];
        var nexts = [];
        var errors = [];
        var completes = [];
        queuedRequests.forEach(function (batchableRequest, index) {
            observables.push(batchableRequest.observable);
            nexts.push(batchableRequest.next);
            errors.push(batchableRequest.error);
            completes.push(batchableRequest.complete);
        });
        var batchedObservable = this.batchHandler(requests, forwards) || Observable.of();
        var onError = function (error) {
            errors.forEach(function (rejecters) {
                if (rejecters) {
                    rejecters.forEach(function (e) { return e(error); });
                }
            });
        };
        batchedObservable.subscribe({
            next: function (results) {
                if (!Array.isArray(results)) {
                    results = [results];
                }
                if (nexts.length !== results.length) {
                    var error = new Error("server returned results with length " + results.length + ", expected length of " + nexts.length);
                    error.result = results;
                    return onError(error);
                }
                results.forEach(function (result, index) {
                    if (nexts[index]) {
                        nexts[index].forEach(function (next) { return next(result); });
                    }
                });
            },
            error: onError,
            complete: function () {
                completes.forEach(function (complete) {
                    if (complete) {
                        complete.forEach(function (c) { return c(); });
                    }
                });
            },
        });
        return observables;
    };
    OperationBatcher.prototype.scheduleQueueConsumption = function (key) {
        var _this = this;
        var requestKey = key || '';
        setTimeout(function () {
            if (_this.queuedRequests.get(requestKey) &&
                _this.queuedRequests.get(requestKey).length) {
                _this.consumeQueue(requestKey);
            }
        }, this.batchInterval);
    };
    return OperationBatcher;
}());

var BatchLink = (function (_super) {
    tslib.__extends(BatchLink, _super);
    function BatchLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, _b = _a.batchInterval, batchInterval = _b === void 0 ? 10 : _b, _c = _a.batchMax, batchMax = _c === void 0 ? 0 : _c, _d = _a.batchHandler, batchHandler = _d === void 0 ? function () { return null; } : _d, _e = _a.batchKey, batchKey = _e === void 0 ? function () { return ''; } : _e;
        _this.batcher = new OperationBatcher({
            batchInterval: batchInterval,
            batchMax: batchMax,
            batchHandler: batchHandler,
            batchKey: batchKey,
        });
        if (fetchParams.batchHandler.length <= 1) {
            _this.request = function (operation) { return _this.batcher.enqueueRequest({ operation: operation }); };
        }
        return _this;
    }
    BatchLink.prototype.request = function (operation, forward) {
        return this.batcher.enqueueRequest({
            operation: operation,
            forward: forward,
        });
    };
    return BatchLink;
}(ApolloLink));

exports.BatchLink = BatchLink;
exports.OperationBatcher = OperationBatcher;
//# sourceMappingURL=batch.cjs.js.map
