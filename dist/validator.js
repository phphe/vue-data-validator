/*!
 * vue-data-validator v2.2.15
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
      this.Vue = Vue;
      Vue.validator = Vue.prototype.$validator = this;

      Vue.prototype.$validate = function (validation, fields) {
        return Vue.validator.validate(validation, fields, this);
      };
    },
    //
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
        Vue: this.Vue,
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
        vm.$set(field, 'isValidationErrorsVisible', function (fields) {
          if (!fields) {
            fields = [field];
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var fld = _step.value;

              if (fld.rules && fld.dirty && !field.validating) {
                if (!field.valid) {
                  return true;
                }
              }
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

          return false;
        });
        vm.$set(field, 'getValidationClass', function (fields) {
          if (!fields) {
            fields = [field];
          }

          var existed;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var fld = _step2.value;

              if (fld.rules && fld.dirty) {
                existed = true;

                if (field.validating) {
                  return _this3.validatingClass;
                } else if (!field.valid) {
                  return _this3.invalidClass;
                }
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

          return existed ? _this3.validClass : null;
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
        var deep = void 0;

        if (field.deep != null) {
          deep = field.deep;
        } else {
          deep = isObject(field.value) || isArray(field.value);
        }

        watcher.unwatch = vm.$watch(watcher.getValue, watcher.handler, {
          deep: deep
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
          Vue: validation.Vue
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
            Vue: validation.Vue
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
      Vue: validation.Vue
    }) : rule.message;
    message = message.replace(/:name/g, nameInMessage).replace(/:value/g, field.value);

    for (var i in rule.params) {
      var reg = new RegExp(':params\\[' + i + '\\]', 'g');
      message = message.replace(reg, rule.params[i]);
    }

    var m = message.match(/:fieldName\(.+?\)/g);

    if (m) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = m[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var t = _step3.value;
          var fieldName = t.match(/\((.+)\)/)[1];
          var fld = validation.fields[fieldName];

          if (!fld) {
            console.warn("vue-data-validator: error when generate error message. Can't found field ".concat(fieldName, ". Current field is ").concat(field.name, "."));
          }

          var text = fld ? getFieldTitle(fld) : '';
          message = message.replace(t, text);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    return message;
  }

  return validator;

})));
