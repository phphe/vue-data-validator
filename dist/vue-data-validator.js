/*!
 * vue-data-validator v2.2.9
 * (c) 2017-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vueDataValidator = {})));
}(this, (function (exports) { 'use strict';

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

  function isset(v) {
    return typeof v !== 'undefined';
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
  function isFunction(v) {
    return typeof v === 'function';
  }
  function isPromise(v) {
    return Object.prototype.toString.call(v) === '[object Promise]';
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
  function objectMap(obj, func) {
    var r = {};

    for (var key in obj) {
      r[key] = func(obj[key], key, obj);
    }

    return r;
  }

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

  var validator = {
    rules: {},
    messages: {},
    validClass: 'has-success',
    invalidClass: 'has-error',
    validtingClass: '',
    // The following methods are not recommended
    install: function install(Vue) {
      Vue.validator = Vue.prototype.$validator = this;

      Vue.prototype.$validate = function (validation, fields) {
        return Vue.validator.validate(validation, fields, this);
      };
    },
    validate: function validate(validation, fields, vm) {
      var _this = this;

      // clear old watchers and reset states
      validation.clear && validation.clear();
      this.initValidation(validation, fields, vm);
      this.initFields(validation, vm); // validate all fields at first

      Object.values(fields).forEach(function (item) {
        return _this.validateField(item, validation);
      });
      return validation;
    },
    initValidation: function initValidation(validation, fields, vm) {
      var defaultValidation = {
        fields: fields,
        dirty: false,
        valid: false,
        validating: false,
        isPause: false,
        _sensitiveFields: [],
        vm: vm,
        isSubmitAble: function isSubmitAble() {
          return this.valid && !this.validating;
        },
        getValues: function getValues() {
          return objectMap(this.fields, function (item) {
            return item.value;
          });
        },
        setValues: function setValues(values) {
          for (var key in values) {
            if (this.fields.hasOwnProperty(key)) {
              this.fields[key].value = values[key];
            }
          }

          return this;
        },
        setDirty: function setDirty(to) {
          this.dirty = to;
          Object.values(this.fields).forEach(function (v) {
            v.dirty = to;
          });
          return this;
        },
        check: function check() {
          var _this2 = this;

          return new Promise(function (resolve, reject) {
            if (_this2.validating) {
              if (!_this2._checkResolves) {
                _this2._checkResolves = [];
              }
            }

            var waitValidating = _this2.validating ? new Promise(function (resolve, reject) {
              _this2._checkResolves.push(resolve);
            }) : Promise.resolve();
            return waitValidating.then(function () {
              if (!_this2.valid) {
                _this2.setDirty(true);

                reject(new Error('invalid'));
              } else {
                resolve(_this2.getValues());
              }
            });
          });
        },
        unwatch: function unwatch() {
          Object.values(this.fields).forEach(function (field) {
            field.watcher && field.watcher.unwatch && field.watcher.unwatch();
          });
          return this;
        },
        pause: function pause() {
          this.isPause = true;
          return this;
        },
        'continue': function _continue() {
          this.isPause = false;
          return this;
        },
        clear: function clear() {
          this.unwatch();
          this.setDirty(false);
          Object.values(this.fields).forEach(function (field) {
            field.required = false;
          });
          return this;
        },
        revalidate: function revalidate() {
          return vm.$validate(this, this.fields);
        },
        getFirstError: function getFirstError() {
          var field = Object.values(this.fields).find(function (field) {
            return Object.values(field.errors)[0];
          });
          return field && Object.values(field.errors)[0];
        },
        getErrors: function getErrors() {
          var errors = [];
          Object.values(this.fields).forEach(function (field) {
            Object.values(field.errors).forEach(function (error) {
              errors.push(error);
            });
          });
          return errors;
        }
      };

      for (var key in defaultValidation) {
        vm.$set(validation, key, defaultValidation[key]);
      }
    },
    initFields: function initFields(validation, vm) {
      var _this3 = this;

      var _loop = function _loop(key) {
        var field = validation.fields[key]; // filed name

        if (!field.name) vm.$set(field, 'name', key);else if (field.name !== key) {
          throw Error('The field name must be same with its key.');
        } // nameInMessage

        if (!field.nameInMessage) {
          field.nameInMessage = getFieldTitle(field);
        } // field value


        vm.$set(field, 'value', isset(field.value) ? field.value : null); // attach states to field

        vm.$set(field, 'dirty', false);
        vm.$set(field, 'valid', false);
        vm.$set(field, 'errors', {});
        vm.$set(field, 'required', false);
        vm.$set(field, 'validating', false);
        vm.$set(field, '_resolvedRules', _this3.resolveRules(field));
        vm.$set(field, 'isValidationErrorsVisible', function () {
          return field.rules && !field.validating && field.dirty && !field.valid;
        });
        vm.$set(field, 'getValidationClass', function () {
          if (field.rules && field.dirty) {
            if (field.validating) {
              return _this3.validatingClass;
            } else {
              return field.valid ? _this3.validClass : _this3.invalidClass;
            }
          }

          return null;
        }); // find field has sensitive rule

        var firstSensitiveRule = Object.values(field._resolvedRules).find(function (item) {
          return item.sensitive;
        });
        if (firstSensitiveRule) validation._sensitiveFields.push(field); // watcher

        var watcher = {
          getValue: function getValue() {
            return field.value;
          },
          handler: function handler(val) {
            if (validation.isPause) return; // set dirty

            if (field._ignoreDirtyOnce) {
              field._ignoreDirtyOnce = false;
            } else {
              field.dirty = true;
              validation.dirty = true;
            }

            _this3.validateField(field, validation); // validate other sensitive field


            validation._sensitiveFields.filter(function (item) {
              return item !== field;
            }).forEach(function (item) {
              _this3.validateField(item, validation);
            });
          }
        };
        watcher.unwatch = vm.$watch(watcher.getValue, watcher.handler, {
          deep: field.deep
        });
        vm.$set(field, 'watcher', watcher);
      };

      for (var key in validation.fields) {
        _loop(key);
      }
    },
    resolveRules: function resolveRules(field) {
      var r = {};

      if (field.rules) {
        var rules = field.rules.split('|');

        for (var k in rules) {
          // get params
          var arr = rules[k].split(':');
          var params = arr[1] ? arr[1].split(',') : [];
          var rule = arr[0];

          if (field.ruleParams && field.ruleParams[rule]) {
            params = params.concat(field.ruleParams[rule]);
          } // get rule obj


          var ruleObj = field.customRules && field.customRules[rule] || this.rules[rule];

          if (isFunction(ruleObj)) {
            ruleObj = {
              handler: ruleObj
            };
          }

          if (ruleObj == null) {
            throw Error("Rule '".concat(rule, "' of field '").concat(field.name, "' is not found."));
          } // result


          r[rule] = {
            name: rule,
            params: params,
            //
            required: ruleObj.required,
            sensitive: ruleObj.sensitive,
            handler: ruleObj.handler,
            message: field.messages && field.messages[rule] || this.messages && this.messages[rule] || 'No error message for :name.'
          };
        }
      }

      return r;
    },
    validateField: function validateField(field, validation) {
      var _this4 = this;

      //
      var validationId = {};
      field._validationId = validationId;
      validation.validating = true;
      field.validating = true;
      this.removeFieldAllErrors(field, validation); //

      var rules = Object.values(field._resolvedRules);
      var queue = Promise.resolve(true);

      var _loop2 = function _loop2() {
        var rule = rules[_i];
        queue = queue.then(function () {
          return _this4.validateRule(rule, field, validation, validationId);
        });
      };

      for (var _i = 0; _i < rules.length; _i++) {
        _loop2();
      }

      queue.then(function () {
        return true;
      }).catch(function (error) {
        return error.message !== 'expired';
      }).then(function (completed) {
        if (completed) {
          // set state: validating of field
          field._validationId = null;
          field.validating = false; // set state: validating of validation

          validation.validating = Object.values(validation.fields).some(function (field) {
            return field.validating;
          });

          if (!validation.validating) {
            if (validation._checkResolves) {
              validation._checkResolves.forEach(function (resolve) {
                resolve();
              });

              validation._checkResolves = null;
            }
          }
        }
      });
    },
    validateRule: function validateRule(rule, field, validation, validationId) {
      var _this5 = this;

      //
      if (rule.required != null) {
        field.required = !isFunction(rule.required) ? rule.required : rule.required({
          value: field.value,
          params: rule.params,
          field: field,
          fields: validation.fields,
          validation: validation,
          Vue: validation.vm.$root.constructor
        });
      } //


      return new Promise(function (resolve, reject) {
        if (field.required || !empty(field.value)) {
          var isValid = rule.handler({
            value: field.value,
            params: rule.params,
            field: field,
            fields: validation.fields,
            validation: validation,
            Vue: validation.vm.$root.constructor
          });
          if (!isPromise(isValid)) isValid = isValid ? Promise.resolve() : Promise.reject(new Error('invalid'));
          isValid.then(function () {
            if (validationId !== field._validationId) reject(new Error('expired')); //

            _this5.removeFieldError(rule, field, validation);

            resolve();
          }).catch(function (error) {
            if (validationId !== field._validationId) reject(new Error('expired')); //

            _this5.addFieldError(rule, field, validation);

            reject(error);
          });
        } else {
          resolve();
        }
      });
    },
    addFieldError: function addFieldError(rule, field, validation) {
      // compile message
      var message = resolveErrorMessage(rule, field, validation); // if error of this rule hasnt set yet, set it
      // copy errors in order

      if (!field.errors[rule.name]) {
        var errors = {};

        for (var k in field._resolvedRules) {
          if (field.errors[k]) {
            errors[k] = field.errors[k];
          } else if (k === rule.name) {
            errors[k] = {};
          }
        }

        field.errors = errors;
      } // set error


      field.errors[rule.name] = {
        name: rule.name,
        message: message,
        field: field // set state

      };
      field.valid = false;
      validation.valid = false;
    },
    removeFieldError: function removeFieldError(rule, field, validation) {
      var errors = {};

      for (var k in field.errors) {
        if (k !== rule.name) {
          errors[k] = field.errors[k];
        }
      }

      field.errors = errors; // set state

      field.valid = Object.keys(field.errors).length === 0;
      validation.valid = Object.values(validation.fields).every(function (field) {
        return field.valid;
      });
    },
    removeFieldAllErrors: function removeFieldAllErrors(field, validation) {
      field.errors = {}; // set state

      field.valid = true;
      validation.valid = Object.values(validation.fields).every(function (field) {
        return field.valid;
      });
    }
  };

  function getFieldTitle(field) {
    return field.nameInMessage || field.text && field.text.toString().toLowerCase() || field.name || 'unnamed';
  }

  function resolveErrorMessage(rule, field, validation) {
    var nameInMessage = field.nameInMessage;
    var message = isFunction(rule.message) ? rule.message({
      value: field.value,
      params: rule.params,
      field: field,
      fields: validation.fields,
      validation: validation,
      Vue: Vue
    }) : rule.message;
    message = message.replace(/:name/g, nameInMessage).replace(/:value/g, field.value);

    for (var i in rule.params) {
      var reg = new RegExp(':params\\[' + i + '\\]', 'g');
      message = message.replace(reg, rule.params[i]);
    }

    var m = message.match(/:fieldName\(.+?\)/g);

    if (m) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = m[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var t = _step.value;
          var fieldName = t.match(/\((.+)\)/)[1];
          var fld = validation.fields[fieldName];

          if (!fld) {
            console.warn("vue-data-validator: error when generate error message. Can't found field ".concat(fieldName, ". Current field is ").concat(field.name, "."));
          }

          var text = fld ? getFieldTitle(fld) : '';
          message = message.replace(t, text);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    return message;
  }

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

  var en = {
    accepted: 'The :name must be accepted.',
    alpha: 'The :name may only contain letters.',
    alphaDash: 'The :name may only contain letters, numbers, and dashes.',
    alphaNum: 'The :name may only contain letters and numbers.',
    between: 'The :name must be between :fieldName(:params[0]) and :fieldName(:params[1]).',
    boolean: 'The :name field must be true or false.',
    date: 'The :name is not a valid date.',
    datetime: 'The :name is not a valid datetime.',
    different: 'The :name and :fieldName(:params[0]) must be different.',
    email: 'The :name must be a valid email address.',
    in: 'The selected :name is invalid.',
    integer: 'The :name must be an integer.',
    length: 'The :name length must be :params[0].',
    lengthBetween: 'The :name length must be between :params[0] and :params[1].',
    max: 'The :name may not be greater than :params[0].',
    maxLength: 'The :name length may not be greater than :params[0].',
    min: 'The :name must be at least :params[0].',
    minLength: 'The :name length must be at least :params[0].',
    notIn: 'The selected :name is invalid.',
    numeric: 'The :name must be a number.',
    regex: 'The :name format is invalid.',
    required: 'The :name field is required.',
    requiredWith: 'The :name field is required when :fieldName(:params[0]) is present.',
    requiredIf: 'The :name field is required.',
    same: 'The :name and :fieldName(:params[0]) must match.',
    size: 'The :name length must be :params[0].',
    string: 'The :name must be a string.',
    // asynchronous rules
    remoteCheck: 'The :name is invalid.',
    remoteNotExisted: 'The :name already exists.'
  };

  var zh_CN = {
    accepted: "\u60A8\u5FC5\u987B\u540C\u610F:name\u624D\u80FD\u7EE7\u7EED\u3002",
    alpha: ":name\u4EC5\u80FD\u5305\u542B\u5B57\u6BCD\u3002",
    alphaDash: ":name\u4EC5\u80FD\u5305\u542B\u5B57\u6BCD\uFF0C\u6570\u5B57\uFF0C\u7834\u6298\u53F7\u548C\u4E0B\u5212\u7EBF\u3002",
    alphaNum: ":name\u4EC5\u80FD\u5305\u542B\u5B57\u6BCD\u548C\u6570\u5B57\u3002",
    between: ":name\u5FC5\u987B\u5728:fieldName(:params[0])\u548C:fieldName(:params[1])\u4E4B\u95F4\u3002",
    boolean: ":name\u5FC5\u987B\u4E3Atrue\u6216false\u3002",
    date: ":name\u5FC5\u987B\u662F\u4E00\u4E2A\u6B63\u786E\u683C\u5F0F\u7684\u65E5\u671F\u3002",
    datetime: ":name\u5FC5\u987B\u662F\u4E00\u4E2A\u6B63\u786E\u683C\u5F0F\u7684\u65E5\u671F\u65F6\u95F4\u3002",
    different: ":name\u4E0D\u80FD\u4E0E:fieldName(:params[0])\u76F8\u540C\u3002",
    email: ":name\u4E0D\u662F\u4E00\u4E2A\u6B63\u786E\u7684\u90AE\u7BB1\u3002",
    in: "\u9009\u62E9\u7684:name\u4E0D\u53EF\u7528\u3002",
    integer: ":name\u5FC5\u987B\u662F\u6574\u6570\u3002",
    length: ":name\u7684\u957F\u5EA6\u5FC5\u987B\u662F:params[0]\u3002",
    lengthBetween: ":name\u7684\u957F\u5EA6\u987B\u5728:params[0]\u548C:params[1]\u4E4B\u95F4\u3002",
    max: ":name\u4E0D\u80FD\u8D85\u8FC7:params[0]\u3002",
    maxLength: ":name\u7684\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7:params[0]\u3002",
    min: ":name\u4E0D\u80FD\u4F4E\u4E8E:params[0]\u3002",
    minLength: ":name\u7684\u957F\u5EA6\u4E0D\u80FD\u4F4E\u4E8E:params[0]\u3002",
    notIn: "\u9009\u62E9\u7684:name\u4E0D\u53EF\u7528\u3002",
    numeric: ":name\u4E0D\u662F\u4E00\u4E2A\u6B63\u786E\u7684\u6570\u5B57\u3002",
    regex: ":name\u683C\u5F0F\u9519\u8BEF\u3002",
    required: "\u8BF7\u586B\u5199:name\u3002",
    requiredWith: "\u8BF7\u586B\u5199:name\u3002\u5F53:fieldName(:params[0])\u4E0D\u4E3A\u7A7A\u65F6\uFF0C:name\u5FC5\u586B\u3002",
    requiredIf: "\u8BF7\u586B\u5199:name\u3002",
    same: ":name\u5FC5\u987B\u4E0E:fieldName(:params[0])\u76F8\u540C\u3002",
    size: ":name\u7684\u957F\u5EA6\u5FC5\u987B\u662F:params[0]\u3002",
    string: ":name\u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u3002",
    // asynchronous rules
    remoteCheck: ":name\u9519\u8BEF\u3002",
    remoteNotExisted: ":name\u5DF2\u5B58\u5728\u3002"
  };

  exports.validator = validator;
  exports.rules = rules;
  exports.enMessages = en;
  exports.zhCNMessages = zh_CN;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
