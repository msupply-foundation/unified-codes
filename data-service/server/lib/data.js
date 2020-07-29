"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RxNavDataSource = exports.DgraphDataSource = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _apolloDatasourceRest = require("apollo-datasource-rest");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var DgraphDataSource = /*#__PURE__*/function (_RESTDataSource) {
  (0, _inherits2["default"])(DgraphDataSource, _RESTDataSource);

  var _super = _createSuper(DgraphDataSource);

  function DgraphDataSource() {
    var _this;

    (0, _classCallCheck2["default"])(this, DgraphDataSource);
    _this = _super.call(this);
    _this.baseURL = 'http://localhost:8080';
    _this.headers = {
      'Content-Type': 'application/graphql+-'
    };
    _this.paths = {
      query: 'query'
    };
    return _this;
  }

  (0, _createClass2["default"])(DgraphDataSource, [{
    key: "willSendRequest",
    value: function willSendRequest(request) {
      Object.entries(this.headers).forEach(function (_ref) {
        var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return request.headers.set(key, value);
      });
    }
  }, {
    key: "postQuery",
    value: function () {
      var _postQuery = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(query) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this.post(this.paths.query, query));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function postQuery(_x) {
        return _postQuery.apply(this, arguments);
      }

      return postQuery;
    }()
  }]);
  return DgraphDataSource;
}(_apolloDatasourceRest.RESTDataSource);

exports.DgraphDataSource = DgraphDataSource;

var RxNavDataSource = /*#__PURE__*/function (_RESTDataSource2) {
  (0, _inherits2["default"])(RxNavDataSource, _RESTDataSource2);

  var _super2 = _createSuper(RxNavDataSource);

  function RxNavDataSource() {
    var _this2;

    (0, _classCallCheck2["default"])(this, RxNavDataSource);
    _this2 = _super2.call(this);
    _this2.baseURL = 'https://rxnav.nlm.nih.gov/REST';
    _this2.paths = {
      interactions: 'interaction/interaction.json'
    };
    return _this2;
  }

  (0, _createClass2["default"])(RxNavDataSource, [{
    key: "getInteractions",
    value: function () {
      var _getInteractions = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(rxCui) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.get(this.paths.interactions, {
                  rxcui: rxCui
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getInteractions(_x2) {
        return _getInteractions.apply(this, arguments);
      }

      return getInteractions;
    }()
  }]);
  return RxNavDataSource;
}(_apolloDatasourceRest.RESTDataSource);

exports.RxNavDataSource = RxNavDataSource;