/*!
 * vue-data-validator v2.2.7
 * (c) 2017-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.vueDataValidator = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return _get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }
  function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
  }
  function isBool(v) {
    return Object.prototype.toString.call(v) === '[object Boolean]';
  }
  function isNumber(v) {
    return Object.prototype.toString.call(v) === '[object Number]';
  }
  function isNumeric(v) {
    return isFinite(v);
  }
  function isString(v) {
    return Object.prototype.toString.call(v) === '[object String]';
  }
  function isObject(v) {
    return Object.prototype.toString.call(v) === '[object Object]';
  }
  function empty(v) {
    if (v == null) {
      return true;
    } else if (v.length != null) {
      return v.length === 0;
    } else if (isBool(v)) {
      return false;
    } else if (isNumber(v)) {
      return isNaN(v);
    } else if (isObject(v)) {
      return Object.keys(v).length === 0;
    }
  } // num

  function onDOM(el, name, handler) {
    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener(name, handler);
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      el.attachEvent("on".concat(name), handler);
    }
  }
  var URLHelper =
  /*#__PURE__*/
  function () {
    // protocol, hostname, port, pastname
    function URLHelper(baseUrl) {
      var _this = this;

      _classCallCheck(this, URLHelper);

      Object.defineProperty(this, "baseUrl", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ''
      });
      Object.defineProperty(this, "search", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: {}
      });
      var t = decodeURI(baseUrl).split('?');
      this.baseUrl = t[0];

      if (t[1]) {
        t[1].split('&').forEach(function (v) {
          var t2 = v.split('=');
          _this.search[t2[0]] = t2[1] == null ? '' : decodeURIComponent(t2[1]);
        });
      }
    }

    _createClass(URLHelper, [{
      key: "getHref",
      value: function getHref() {
        var _this2 = this;

        var t = [this.baseUrl];
        var searchStr = Object.keys(this.search).map(function (k) {
          return "".concat(k, "=").concat(encodeURIComponent(_this2.search[k]));
        }).join('&');

        if (searchStr) {
          t.push(searchStr);
        }

        return t.join('?');
      }
    }]);

    return URLHelper;
  }(); // 解析函数参数, 帮助重载

  function makeStorageHelper(storage) {
    return {
      storage: storage,
      set: function set(name, value, minutes) {
        if (value == null) {
          this.storage.removeItem(name);
        } else {
          this.storage.setItem(name, JSON.stringify({
            value: value,
            expired_at: minutes && new Date().getTime() / 1000 + minutes * 60
          }));
        }
      },
      get: function get$$1(name) {
        var t = this.storage.getItem(name);

        if (t) {
          t = JSON.parse(t);

          if (!t.expired_at || t.expired_at > new Date().getTime()) {
            return t.value;
          } else {
            this.storage.removeItem(name);
          }
        }

        return null;
      },
      clear: function clear() {
        this.storage.clear();
      }
    };
  }
  var localStorage2 = makeStorageHelper(window.localStorage);
  var sessionStorage2 = makeStorageHelper(window.sessionStorage); // 事件处理

  var EventProcessor =
  /*#__PURE__*/
  function () {
    function EventProcessor() {
      _classCallCheck(this, EventProcessor);

      Object.defineProperty(this, "eventStore", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: []
      });
    }

    _createClass(EventProcessor, [{
      key: "on",
      value: function on(name, handler) {
        this.eventStore.push({
          name: name,
          handler: handler
        });
      }
    }, {
      key: "once",
      value: function once(name, handler) {
        var _this3 = this;

        var off = function off() {
          _this3.off(name, wrappedHandler);
        };

        var wrappedHandler = function wrappedHandler() {
          handler();
          off();
        };

        this.on(name, wrappedHandler);
        return off;
      }
    }, {
      key: "off",
      value: function off(name, handler) {
        var indexes = []; // to remove indexes; reverse; 倒序的

        var len = this.eventStore.length;

        for (var i = 0; i < len; i++) {
          var item = this.eventStore[i];

          if (item.name === name && item.handler === handler) {
            indexes.unshift(i);
          }
        }

        for (var _i2 = 0; _i2 < indexes.length; _i2++) {
          var index = indexes[_i2];
          this.eventStore.splice(index, 1);
        }
      }
    }, {
      key: "emit",
      value: function emit(name) {
        // 重要: 先找到要执行的项放在新数组里, 因为执行项会改变事件项存储数组
        var items = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.eventStore[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if (item.name === name) {
              items.push(item);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        for (var _i3 = 0; _i3 < items.length; _i3++) {
          var _item = items[_i3];

          _item.handler.apply(_item, args);
        }
      }
    }]);

    return EventProcessor;
  }();
  var CrossWindow =
  /*#__PURE__*/
  function (_EventProcessor) {
    _inherits(CrossWindow, _EventProcessor);

    function CrossWindow() {
      var _this4;

      _classCallCheck(this, CrossWindow);

      _this4 = _possibleConstructorReturn(this, (CrossWindow.__proto__ || Object.getPrototypeOf(CrossWindow)).call(this));
      Object.defineProperty(_assertThisInitialized(_this4), "storageName", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: '_crossWindow'
      });
      var cls = CrossWindow;

      if (!cls._listen) {
        cls._listen = true;
        onDOM(window, 'storage', function (ev) {
          if (ev.key === _this4.storageName) {
            var _get2;

            var event = JSON.parse(ev.newValue);

            (_get2 = _get(CrossWindow.prototype.__proto__ || Object.getPrototypeOf(CrossWindow.prototype), "emit", _assertThisInitialized(_this4))).call.apply(_get2, [_this4, event.name].concat(_toConsumableArray(event.args)));
          }
        });
      }

      return _this4;
    }

    _createClass(CrossWindow, [{
      key: "emit",
      value: function emit(name) {
        var _get3;

        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        (_get3 = _get(CrossWindow.prototype.__proto__ || Object.getPrototypeOf(CrossWindow.prototype), "emit", this)).call.apply(_get3, [this, name].concat(args));

        window.localStorage.setItem(this.storageName, JSON.stringify({
          name: name,
          args: args,
          // use random make storage event triggered every time
          // 加入随机保证触发storage事件
          random: Math.random()
        }));
      }
    }]);

    return CrossWindow;
  }(EventProcessor); // arr, idKey/getId

  var rules = {
    accepted: function accepted(_ref) {
      var value = _ref.value;
      return value === 'yes' || value === 'on' || value === true || value === 1 || value === '1';
    },
    alpha: function alpha(_ref2) {
      var value = _ref2.value;
      return /^[a-zA-Z]+$/.test(value);
    },
    alphaDash: function alphaDash(_ref3) {
      var value = _ref3.value;
      return /^[\w-]+$/.test(value);
    },
    alphaNum: function alphaNum(_ref4) {
      var value = _ref4.value;
      return /^[\w]+$/.test(value);
    },
    between: function between(_ref5) {
      var value = _ref5.value,
          params = _ref5.params;
      return params[0] <= value && params[1] <= value;
    },
    boolean: function boolean(_ref6) {
      var value = _ref6.value;
      return [true, false, 1, 0, '1', '0'].includes(value);
    },
    date: function date(_ref7) {
      var value = _ref7.value;
      return /^\d\d\d\d-\d\d?-\d\d?$/.test(value);
    },
    datetime: function datetime(_ref8) {
      var value = _ref8.value;
      return /^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(value);
    },
    different: {
      handler: function handler(_ref9) {
        var value = _ref9.value,
            params = _ref9.params,
            field = _ref9.field,
            fields = _ref9.fields;
        var relatedField = fields[params[0]];
        return value !== relatedField.value;
      },
      sensitive: true
    },
    email: function email(_ref10) {
      var value = _ref10.value;
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    },
    in: function _in(_ref11) {
      var value = _ref11.value,
          params = _ref11.params;
      var list = isArray(params[0]) ? params[0] : params;
      return list.indexOf(value) > -1;
    },
    integer: function integer(_ref12) {
      var value = _ref12.value;
      var reg = /^\-?\d+$/;
      return reg.test(value);
    },
    length: function length(_ref13) {
      var value = _ref13.value,
          params = _ref13.params;
      return (value || '').length === parseInt(params[0]);
    },
    lengthBetween: function lengthBetween(_ref14) {
      var value = _ref14.value,
          params = _ref14.params;
      var len = (value || '').length;
      return params[0] <= len && len <= params[1];
    },
    max: function max$$1(_ref15) {
      var value = _ref15.value,
          params = _ref15.params;
      return value <= params[0];
    },
    maxLength: function maxLength(_ref16) {
      var value = _ref16.value,
          params = _ref16.params;
      return (value || '').length <= params[0];
    },
    min: function min$$1(_ref17) {
      var value = _ref17.value,
          params = _ref17.params;
      return value >= params[0];
    },
    minLength: function minLength(_ref18) {
      var value = _ref18.value,
          params = _ref18.params;
      return (value || '').length >= params[0];
    },
    notIn: function notIn(_ref19) {
      var value = _ref19.value,
          params = _ref19.params;
      var list = isArray(params[0]) ? params[0] : params;
      return list.indexOf(value) === -1;
    },
    numeric: function numeric(_ref20) {
      var value = _ref20.value;
      return isNumeric(value);
    },
    regex: function regex(_ref21) {
      var value = _ref21.value,
          params = _ref21.params;
      var reg = isString(params[0]) ? new RegExp(params[0]) : params[0];
      return reg.test(value);
    },
    required: {
      handler: function handler(_ref22) {
        var value = _ref22.value,
            params = _ref22.params,
            field = _ref22.field;
        return !empty(value);
      },
      required: true
    },
    requiredWith: {
      handler: function handler(_ref23) {
        var value = _ref23.value;
        return !empty(value);
      },
      sensitive: true,
      required: function required(_ref24) {
        var value = _ref24.value,
            params = _ref24.params,
            field = _ref24.field,
            fields = _ref24.fields;
        return !empty(fields[params[0]].value);
      }
    },
    requiredIf: {
      handler: function handler(_ref25) {
        var value = _ref25.value;
        return !empty(value);
      },
      sensitive: true,
      required: function required(arg) {
        return arg.params[0](arg);
      }
    },
    same: {
      handler: function handler(_ref26) {
        var value = _ref26.value,
            params = _ref26.params,
            field = _ref26.field,
            fields = _ref26.fields;
        var relatedField = fields[params[0]];
        return value === relatedField.value;
      },
      sensitive: true
    },
    size: function size(_ref27) {
      var value = _ref27.value,
          params = _ref27.params;
      return (value || '').length === parseInt(params[0]);
    },
    string: function string(_ref28) {
      var value = _ref28.value;
      return isString(value);
    },
    // asynchronous rules
    // Vue.http must be available
    remoteCheck: function remoteCheck(_ref29) {
      var value = _ref29.value,
          params = _ref29.params,
          field = _ref29.field,
          fields = _ref29.fields,
          validation = _ref29.validation,
          Vue = _ref29.Vue;
      var expected = isArray(params[1]) ? params[1] : [params[1]];

      if (expected.includes(value)) {
        return true;
      }

      var url = params[0];
      return Vue.http.post(url, {
        value: value
      }).then(function (_ref30) {
        var data = _ref30.data;
        return data ? Promise.resolve() : Promise.reject(new Error('invalid'));
      });
    },
    remoteNotExisted: function remoteNotExisted(obj) {
      return rules.remoteCheck(obj);
    }
  };

  return rules;

})));
