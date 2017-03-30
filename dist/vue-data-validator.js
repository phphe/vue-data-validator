/*!
 * vue-data-validator v1.2.8
 * phphe
 * https://github.com/phphe/vue-data-validator.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vueDataValidatorVueDataValidator = global.vueDataValidatorVueDataValidator || {}, global.vueDataValidatorVueDataValidator.js = global.vueDataValidatorVueDataValidator.js || {})));
}(this, (function (exports) { 'use strict';

// need 'babel-polyfill'
// is 各种判断
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
  var num = parseFloat(v);
  return !isNaN(num) && isNumber(num);
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
}
// num


// str 字符
function studlyCase(str) {
  return str && str[0].toUpperCase() + str.substr(1);
}





// array





// object


function objectMap(obj, func) {
  var r = {};
  for (var key in obj) {
    r[key] = func(obj[key], key, obj);
  }
  return r;
}

// url
/* eslint-disable */



function getOffset(el) {
  var elOffset = {
    x: el.offsetLeft,
    y: el.offsetTop
  };
  var parentOffset = { x: 0, y: 0 };
  if (el.offsetParent != null) parentOffset = getOffset(el.offsetParent);
  return {
    x: elOffset.x + parentOffset.x,
    y: elOffset.y + parentOffset.y
  };
}


/**
 * [isOffsetInEl]
 * @param {Number} x
 * @param {Number} y
 * @param {Object} el HTML Element
 */

// get border

// advance
// binarySearch 二分查找

// overload waitFor(condition, time = 100, maxCount = 1000))
function waitFor(name, condition) {
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
  var maxCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;

  if (isFunction(name)) {
    maxCount = time;
    time = isNumeric(condition) ? condition : 100;
    condition = name;
    name = null;
  }
  if (!waitFor._waits) {
    waitFor._waits = {};
  }
  var waits = waitFor._waits;
  if (name && isset(waits[name])) {
    window.clearInterval(waits[name]);
    delete waits[name];
  }
  return new Promise(function (resolve, reject) {
    var count = 0;
    function judge(interval) {
      if (count <= maxCount) {
        if (condition()) {
          stop(interval, name);
          resolve();
        }
      } else {
        stop(interval, name);
        reject(new Error('waitFor: Limit is reached'));
      }
      count++;
    }
    function stop(interval, name) {
      if (interval) {
        if (name && isset(waits[name])) {
          window.clearInterval(waits[name]);
          delete waits[name];
        } else {
          window.clearInterval(interval);
        }
      }
    }
    var interval = window.setInterval(function () {
      judge(interval);
    }, time);
    if (name) {
      waits[name] = interval;
    }
    judge();
  });
}

var validator = {
  rules: {},
  messages: {},
  validClass: 'has-success',
  invalidClass: 'has-error',
  validtingClass: '',
  // The following methods are not recommended
  install: function (Vue) {
    Vue.validator = Vue.prototype.$validator = this;
    Vue.prototype.$validate = function (validation, fields) {
      return Vue.validator.validate(validation, fields, this);
    };
  },
  validate: function (validation, fields, vm) {
    var _this = this;

    // clear old watchers and reset states
    validation.clear && validation.clear();
    this.initValidation(validation, fields, vm);
    this.initFields(validation, vm);
    // validate all fields at first
    Object.values(fields).forEach(function (item) {
      return _this.validateField(item, validation);
    });
  },
  initValidation: function (validation, fields, vm) {
    var defaultValidation = {
      fields: fields,
      dirty: false,
      valid: false,
      validating: false,
      _sensitiveFields: [],
      vm: vm,
      getValues: function () {
        return objectMap(this.fields, function (item) {
          return item.value;
        });
      },
      setValues: function (values) {
        for (var key in values) {
          if (this.fields.hasOwnProperty(key)) {
            this.fields[key].value = values[key];
          }
        }
        return this;
      },
      setDirty: function (to) {
        this.dirty = to;
        Object.values(this.fields).forEach(function (v) {
          v.dirty = to;
        });
        return this;
      },
      check: function () {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          if (_this2.validating) {
            reject(new Error('Data is being validated'));
          } else if (!_this2.valid) {
            _this2.setDirty(true);
            reject(new Error('Data is invalid'));
          } else {
            resolve(_this2.getValues());
          }
        });
      },
      unwatch: function () {
        Object.values(this.fields).forEach(function (field) {
          field.watcher && field.watcher.unwatch && field.watcher.unwatch();
        });
      },
      pause: function () {
        this.unwatch();
      },
      'continue': function () {
        var _this3 = this;

        this.unwatch();
        Object.values(this.fields).forEach(function (field) {
          var watcher = field.watcher;
          watcher.unwatch = _this3.vm.$watch(watcher.getValue, watcher.handler);
        });
      },
      clear: function () {
        this.unwatch();
        Object.values(this.fields).forEach(function (field) {
          field.required = false;
          field.dirty = false;
        });
        this.dirty = false;
      }
    };
    for (var key in defaultValidation) {
      vm.$set(validation, key, defaultValidation[key]);
    }
  },
  initFields: function (validation, vm) {
    var _this4 = this;

    var _loop = function (key) {
      var field = validation.fields[key];
      // filed name
      if (!field.name) vm.$set(field, 'name', key);else if (field.name !== key) {
        throw Error('The field name must be same with its key.');
      }
      // field value
      if (!isset(field.value)) vm.$set(field, 'value', null);
      // attach states to field
      vm.$set(field, 'dirty', false);
      vm.$set(field, 'valid', false);
      vm.$set(field, 'errors', {});
      vm.$set(field, 'required', false);
      vm.$set(field, 'validating', false);
      vm.$set(field, '_resolvedRules', _this4.resolveRules(field));
      vm.$set(field, 'errorsVisible', function () {
        return field.rules && !field.validating && field.dirty && !field.valid;
      });
      vm.$set(field, 'validationClass', function () {
        if (field.rules && field.dirty) {
          if (field.validating) {
            return _this4.validatingClass;
          } else {
            return field.valid ? _this4.validClass : _this4.invalidClass;
          }
        }
        return null;
      });
      // find field has sensitive rule
      var firstSensitiveRule = Object.values(field._resolvedRules).find(function (item) {
        return item.sensitive;
      });
      if (firstSensitiveRule) validation._sensitiveFields.push(field);
      // watcher
      var watcher = {
        getValue: function () {
          return field.value;
        },

        handler: function (val) {
          _this4.validateField(field, validation);
          field.dirty = true;
          validation.dirty = true;
          // validate other sensitive field
          validation._sensitiveFields.filter(function (item) {
            return item !== field;
          }).forEach(function (item) {
            _this4.validateField(item, validation);
          });
        }
      };
      watcher.unwatch = vm.$watch(watcher.getValue, watcher.handler);
      vm.$set(field, 'watcher', watcher);
    };

    for (var key in validation.fields) {
      _loop(key);
    }
  },
  resolveRules: function (field) {
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
        }
        // get rule obj
        var ruleObj = field.customRules && field.customRules[rule] || this.rules[rule];
        if (isFunction(ruleObj)) {
          ruleObj = {
            handler: ruleObj
          };
        }
        if (ruleObj == null) {
          throw Error('Rule \'' + rule + '\' of field \'' + field.name + '\' is not found.');
        }
        // result
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
  validateField: function (field, validation) {
    var _this5 = this;

    //
    var validationId = {};
    field._validationId = validationId;
    validation.validating = true;
    field.validating = true;
    this.removeFieldAllErrors(field, validation);
    //
    var rules = Object.values(field._resolvedRules);
    var done = function () {
      // set state: validating of field
      field._validationId = null;
      field.validating = false;
      // set state: validating of validation
      validation.validating = Object.values(validation.fields).some(function (field) {
        return field.validating;
      });
    };
    var queue = function () {
      if (rules.length === 0) {
        done();
      } else {
        var rule = rules.shift();
        _this5.validateRule(rule, field, validation, validationId).then(function () {
          if (validationId !== field._validationId) return;
          queue();
        }).catch(function (er) {
          // failed or expired
          done();
        });
      }
    };
    queue();
  },
  validateRule: function (rule, field, validation, validationId) {
    var _this6 = this;

    //
    if (rule.required != null) {
      field.required = !isFunction(rule.required) ? rule.required : rule.required(field.value, rule.params, field, validation.fields, validation, validation.vm.constructor);
    }
    //
    return new Promise(function (resolve, reject) {
      if (field.required || !empty(field.value)) {
        var isValid = rule.handler(field.value, rule.params, field, validation.fields, validation, validation.vm.constructor);
        if (!isPromise(isValid)) isValid = isValid ? Promise.resolve() : Promise.reject(new Error('invalid. field:' + field.name + ', rule:' + rule.name));
        isValid.then(function () {
          if (validationId !== field._validationId) reject(new Error('expired'));
          //
          _this6.removeFieldError(rule, field, validation);
          resolve();
        }).catch(function () {
          if (validationId !== field._validationId) reject(new Error('expired'));
          //
          _this6.addFieldError(rule, field, validation);
          reject(new Error('invalid'));
        });
      } else {
        resolve();
      }
    });
  },
  addFieldError: function (rule, field, validation) {
    // compile message
    var nameInMessage = field.nameInMessage || field.text && field.text.toString().toLowerCase() || field.name || 'unnamed';
    var message = rule.message.replace(/:name/g, nameInMessage).replace(/:value/g, field.value);
    for (var i in rule.params) {
      var reg = new RegExp(':params\\[' + i + '\\]', 'g');
      message = message.replace(reg, rule.params[i]);
    }
    // if error of this rule hasnt set yet, set it
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
    }
    // set error
    field.errors[rule.name] = {
      name: rule.name,
      message: message
    };
    // set state
    field.valid = false;
    validation.valid = false;
  },
  removeFieldError: function (rule, field, validation) {
    var errors = {};
    for (var k in field.errors) {
      if (k !== rule.name) {
        errors[k] = field.errors[k];
      }
    }
    field.errors = errors;
    // set state
    field.valid = Object.keys(field.errors).length === 0;
    validation.valid = Object.values(validation.fields).every(function (field) {
      return field.valid;
    });
  },
  removeFieldAllErrors: function (field, validation) {
    field.errors = {};
    // set state
    field.valid = true;
    validation.valid = Object.values(validation.fields).every(function (field) {
      return field.valid;
    });
  }
};

var rules = {
  accepted: function (val) {
    return val === 'yes' || val === 'on' || val === true || val === 1 || val === '1';
  },
  alpha: function (val) {
    return (/^[a-zA-Z]+$/.test(val)
    );
  },
  alphaDash: function (val) {
    return (/^[\w-]+$/.test(val)
    );
  },
  alphaNum: function (val) {
    return (/^[\w]+$/.test(val)
    );
  },
  between: function (val, params) {
    return params[0] <= val && params[1] <= val;
  },
  boolean: function (val) {
    return [true, false, 1, 0, '1', '0'].includes(val);
  },
  date: function (val) {
    return (/^\d\d\d\d-\d\d?-\d\d?$/.test(val)
    );
  },
  datetime: function (val) {
    return (/^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(val)
    );
  },
  different: {
    handler: function (val, params, field, fields) {
      var relatedField = fields[params[0]];
      return val !== relatedField.value;
    },
    sensitive: true
  },
  email: function (val) {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    );
  },
  in: function (val, params) {
    var list = isArray(params[0]) ? params[0] : params;
    return list.indexOf(val) > -1;
  },
  integer: function (val) {
    return (/^-?[1-9]\d*$/.test(val)
    );
  },
  length: function (val, params) {
    return (val || '').toString().length === parseInt(params[0]);
  },
  lengthBetween: function (val, params) {
    var len = (val || '').toString().length;
    return params[0] <= len && len <= params[1];
  },
  max: function (val, params) {
    return val <= params[0];
  },
  maxLength: function (val, params) {
    return (val || '').toString().length <= params[0];
  },
  min: function (val, params) {
    return val >= params[0];
  },
  minLength: function (val, params) {
    return (val || '').toString().length >= params[0];
  },
  notIn: function (val, params) {
    var list = isArray(params[0]) ? params[0] : params;
    return list.indexOf(val) === -1;
  },
  numeric: function (val) {
    return isNumeric(val);
  },
  required: {
    handler: function (val, params, field) {
      return !empty(val);
    },
    required: true
  },
  requiredWith: {
    handler: function (val) {
      return !empty(val);
    },
    sensitive: true,
    required: function (val, params, field, fields) {
      return !empty(fields[params[0]].value);
    }
  },
  same: {
    handler: function (val, params, field, fields) {
      var relatedField = fields[params[0]];
      return val === relatedField.value;
    },
    sensitive: true
  },
  size: function (val, params) {
    return (val || '').toString().length === parseInt(params[0]);
  },
  string: function (val) {
    return isString(val);
  },
  // asynchronous rules
  // Vue.http must be available
  remoteCheck: function (val, params, field, fields, validation, Vue) {
    if (typeof params[1] !== 'undefined') {
      var expected = isArray(params[1]) ? params[1] : [params[1]];
      if (expected.indexOf(val) > -1) {
        return true;
      }
    }
    return new Promise(function (resolve, reject) {
      var url = params[0].replace(/:value/g, val);
      return Vue.http.get(url).then(function (resp) {
        if (resp.data === true || resp.data === 1 || resp.data === 'true') {
          resolve(resp.data, resp.status, resp);
        } else {
          reject(resp.data, resp.status, resp);
        }
      }).catch(function (resp) {
        reject(resp.data, resp.status, resp);
      });
    });
  },
  remoteNotExisted: function (val, params, field, fields, validation, Vue) {
    return this.remoteCheck(val, params, field, fields, validation, Vue);
  }
};

var en = {
  accepted: 'The :name must be accepted.',
  alpha: 'The :name may only contain letters.',
  alphaDash: 'The :name may only contain letters, numbers, and dashes.',
  alphaNum: 'The :name may only contain letters and numbers.',
  between: 'The :name must be between :params[0] and :params[1].',
  boolean: 'The :name field must be true or false.',
  date: 'The :name is not a valid date.',
  datetime: 'The :name is not a valid datetime.',
  different: 'The :name and :params[0] must be different.',
  email: 'The :name must be a valid email address.',
  in: 'The selected :name is invalid.',
  integer: 'The :name must be an integer.',
  length: 'The :name must be :params[0] characters.',
  lengthBetween: 'The :name must be between :params[0] and :params[1] characters.',
  max: 'The :name may not be greater than :params[0].',
  maxLength: 'The :name may not be greater than :params[0] characters.',
  min: 'The :name must be at least :params[0].',
  minLength: 'The :name must be at least :params[0] characters.',
  notIn: 'The selected :name is invalid.',
  numeric: 'The :name must be a number.',
  required: 'The :name field is required.',
  requiredWith: 'The :name field is required when :params[1] is present.',
  same: 'The :name and :params[1] must match.',
  size: 'The :name must be :params[0] characters.',
  string: 'The :name must be a string.',
  // asynchronous rules
  remoteCheck: 'The :name is invalid.',
  remoteNotExisted: 'The :name already exists.'
};

var zh_CN = {
  accepted: '您必须同意:name才能继续。',
  alpha: ':name仅能包含字母。',
  alphaDash: ':name仅能包含字母，数字，破折号和下划线。',
  alphaNum: ':name仅能包含字母和数字。',
  between: ':name必须在:params[0]和:params[1]之间。',
  boolean: ':name必须为true或false。',
  date: ':name必须是一个正确格式的日期。',
  datetime: ':name必须是一个正确格式的日期时间。',
  different: ':name不能与:params[0]相同。',
  email: ':name不是一个正确的邮箱。',
  in: '选择的:name不可用。',
  integer: ':name必须是整数。',
  length: ':name必须包含:params[0]个字符。',
  lengthBetween: ':name的长度须在:params[0]和:params[1]之间。',
  max: ':name不能超过:params[0]。',
  maxLength: ':name的长度不能超过:params[0]。',
  min: ':name不能低于:params[0]。',
  minLength: ':name的长度不能低于:params[0]。',
  notIn: '选择的:name不可用。',
  numeric: ':name不是一个正确的数字。',
  required: '请填写:name。',
  requiredWith: '请填写:name。当:params[1]不为空时，:name必填。',
  same: ':name必须与:params[1]相同。',
  size: ':name必须有:params[0]个字符。',
  string: ':name必须是字符串。',
  // asynchronous rules
  remoteCheck: ':name错误。',
  remoteNotExisted: ':name已存在。'
};

exports.validator = validator;
exports.rules = rules;
exports.enMessages = en;
exports.zhCNMessages = zh_CN;

Object.defineProperty(exports, '__esModule', { value: true });

})));
