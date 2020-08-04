'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib = require('tslib');
var tsInvariant = require('ts-invariant');
var Observable = _interopDefault(require('zen-observable'));
require('symbol-observable');
require('fast-json-stable-stringify');
var printer = require('graphql/language/printer');

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

function fromError(errorValue) {
    return new Observable(function (observer) {
        observer.error(errorValue);
    });
}

var serializeFetchParameter = function (p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    }
    catch (e) {
        var parseError = process.env.NODE_ENV === "production" ? new tsInvariant.InvariantError(34) : new tsInvariant.InvariantError("Network request failed. " + label + " is not serializable: " + e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};

var selectURI = function (operation, fallbackURI) {
    var context = operation.getContext();
    var contextURI = context.uri;
    if (contextURI) {
        return contextURI;
    }
    else if (typeof fallbackURI === 'function') {
        return fallbackURI(operation);
    }
    else {
        return fallbackURI || '/graphql';
    }
};

var throwServerError = function (response, result, message) {
    var error = new Error(message);
    error.name = 'ServerError';
    error.response = response;
    error.statusCode = response.status;
    error.result = result;
    throw error;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;
function parseAndCheckHttpResponse(operations) {
    return function (response) { return response
        .text()
        .then(function (bodyText) {
        try {
            return JSON.parse(bodyText);
        }
        catch (err) {
            var parseError = err;
            parseError.name = 'ServerParseError';
            parseError.response = response;
            parseError.statusCode = response.status;
            parseError.bodyText = bodyText;
            throw parseError;
        }
    })
        .then(function (result) {
        if (response.status >= 300) {
            throwServerError(response, result, "Response not successful: Received status code " + response.status);
        }
        if (!Array.isArray(result) &&
            !hasOwnProperty.call(result, 'data') &&
            !hasOwnProperty.call(result, 'errors')) {
            throwServerError(response, result, "Server response was missing for query '" + (Array.isArray(operations)
                ? operations.map(function (op) { return op.operationName; })
                : operations.operationName) + "'.");
        }
        return result;
    }); };
}

var checkFetcher = function (fetcher) {
    if (!fetcher && typeof fetch === 'undefined') {
        throw process.env.NODE_ENV === "production" ? new tsInvariant.InvariantError(35) : new tsInvariant.InvariantError("\n\"fetch\" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:\n\nimport fetch from 'cross-fetch';\nimport { ApolloClient, HttpLink } from '@apollo/client';\nconst client = new ApolloClient({\n  link: new HttpLink({ uri: '/graphql', fetch })\n});\n    ");
    }
};

var defaultHttpOptions = {
    includeQuery: true,
    includeExtensions: false,
};
var defaultHeaders = {
    accept: '*/*',
    'content-type': 'application/json',
};
var defaultOptions = {
    method: 'POST',
};
var fallbackHttpConfig = {
    http: defaultHttpOptions,
    headers: defaultHeaders,
    options: defaultOptions,
};
var selectHttpOptionsAndBody = function (operation, fallbackConfig) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    var options = tslib.__assign(tslib.__assign({}, fallbackConfig.options), { headers: fallbackConfig.headers, credentials: fallbackConfig.credentials });
    var http = fallbackConfig.http || {};
    configs.forEach(function (config) {
        options = tslib.__assign(tslib.__assign(tslib.__assign({}, options), config.options), { headers: tslib.__assign(tslib.__assign({}, options.headers), config.headers) });
        if (config.credentials)
            options.credentials = config.credentials;
        http = tslib.__assign(tslib.__assign({}, http), config.http);
    });
    var operationName = operation.operationName, extensions = operation.extensions, variables = operation.variables, query = operation.query;
    var body = { operationName: operationName, variables: variables };
    if (http.includeExtensions)
        body.extensions = extensions;
    if (http.includeQuery)
        body.query = printer.print(query);
    return {
        options: options,
        body: body,
    };
};

var createSignalIfSupported = function () {
    if (typeof AbortController === 'undefined')
        return { controller: false, signal: false };
    var controller = new AbortController();
    var signal = controller.signal;
    return { controller: controller, signal: signal };
};

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

var BatchHttpLink = (function (_super) {
    tslib.__extends(BatchHttpLink, _super);
    function BatchHttpLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, _b = _a.uri, uri = _b === void 0 ? '/graphql' : _b, fetcher = _a.fetch, includeExtensions = _a.includeExtensions, batchInterval = _a.batchInterval, batchMax = _a.batchMax, batchKey = _a.batchKey, requestOptions = tslib.__rest(_a, ["uri", "fetch", "includeExtensions", "batchInterval", "batchMax", "batchKey"]);
        checkFetcher(fetcher);
        if (!fetcher) {
            fetcher = fetch;
        }
        var linkConfig = {
            http: { includeExtensions: includeExtensions },
            options: requestOptions.fetchOptions,
            credentials: requestOptions.credentials,
            headers: requestOptions.headers,
        };
        _this.batchInterval = batchInterval || 10;
        _this.batchMax = batchMax || 10;
        var batchHandler = function (operations) {
            var chosenURI = selectURI(operations[0], uri);
            var context = operations[0].getContext();
            var clientAwarenessHeaders = {};
            if (context.clientAwareness) {
                var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
                if (name_1) {
                    clientAwarenessHeaders['apollographql-client-name'] = name_1;
                }
                if (version) {
                    clientAwarenessHeaders['apollographql-client-version'] = version;
                }
            }
            var contextConfig = {
                http: context.http,
                options: context.fetchOptions,
                credentials: context.credentials,
                headers: tslib.__assign(tslib.__assign({}, clientAwarenessHeaders), context.headers),
            };
            var optsAndBody = operations.map(function (operation) {
                return selectHttpOptionsAndBody(operation, fallbackHttpConfig, linkConfig, contextConfig);
            });
            var loadedBody = optsAndBody.map(function (_a) {
                var body = _a.body;
                return body;
            });
            var options = optsAndBody[0].options;
            if (options.method === 'GET') {
                return fromError(new Error('apollo-link-batch-http does not support GET requests'));
            }
            try {
                options.body = serializeFetchParameter(loadedBody, 'Payload');
            }
            catch (parseError) {
                return fromError(parseError);
            }
            var controller;
            if (!options.signal) {
                var _b = createSignalIfSupported(), _controller = _b.controller, signal = _b.signal;
                controller = _controller;
                if (controller)
                    options.signal = signal;
            }
            return new Observable(function (observer) {
                fetcher(chosenURI, options)
                    .then(function (response) {
                    operations.forEach(function (operation) { return operation.setContext({ response: response }); });
                    return response;
                })
                    .then(parseAndCheckHttpResponse(operations))
                    .then(function (result) {
                    observer.next(result);
                    observer.complete();
                    return result;
                })
                    .catch(function (err) {
                    if (err.name === 'AbortError')
                        return;
                    if (err.result && err.result.errors && err.result.data) {
                        observer.next(err.result);
                    }
                    observer.error(err);
                });
                return function () {
                    if (controller)
                        controller.abort();
                };
            });
        };
        batchKey =
            batchKey ||
                (function (operation) {
                    var context = operation.getContext();
                    var contextConfig = {
                        http: context.http,
                        options: context.fetchOptions,
                        credentials: context.credentials,
                        headers: context.headers,
                    };
                    return selectURI(operation, uri) + JSON.stringify(contextConfig);
                });
        _this.batcher = new BatchLink({
            batchInterval: _this.batchInterval,
            batchMax: _this.batchMax,
            batchKey: batchKey,
            batchHandler: batchHandler,
        });
        return _this;
    }
    BatchHttpLink.prototype.request = function (operation) {
        return this.batcher.request(operation);
    };
    return BatchHttpLink;
}(ApolloLink));

exports.BatchHttpLink = BatchHttpLink;
//# sourceMappingURL=batch-http.cjs.js.map
