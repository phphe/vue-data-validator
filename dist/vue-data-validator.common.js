/*!
 * vue-data-validator v1.2.2
 * https://github.com/phphe/vue-data-validator
 * Released under the MIT License.
 */

'use strict';

var Vue;
var validator = {
  options: {},
  add: function (rules, messages) {
    if (!messages) messages = {};
    Object.assign(validator.options.rules, rules);
    Object.assign(validator.options.messages, messages);
  },
  install: function (Vue2, options) {
    Vue = Vue2;
    Vue.validator = Vue.prototype.$validator = validator;
    if (options) validator.options = options;
    Vue.prototype.$validate = function (name, fields) {
      return validate(name, fields, this);
    };
  }
};
function validate(name, fields, vm) {
  // clear old validation
  vm[name] && vm[name].clear && vm[name].clear();
  // create
  var validation = createValidation(name, fields, vm);
  // attach validation to vm
  vm[name] = validation;
  //
  initFields(validation, vm);
  // validate at first
  for (var _iterator = Object.values(fields), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var field = _ref;

    validateField(field, validation);
  }
}
function validateField(field, validation) {
  //
  var validationId = {};
  field._validationId = validationId;
  validation.validating = true;
  field.validating = true;
  //
  subAllErrors(field, validation);
  //
  var rules = Object.values(field._resolvedRules);
  var index = 0;
  var next = void 0,
      end = void 0;
  next = function () {
    if (validationId !== field._validationId) return;
    //
    var rule = rules[index];
    if (!rule) return end();
    // wrap required to promise
    var isRequired = rule.rule.required;
    var required = field.required;
    if (isRequired != null) {
      if (typeof isRequired !== 'function') isRequired = function () {
        return rule.rule.required;
      };
      required = isRequired(field.value, rule.params, field, validation.fields, validation, Vue);
    }
    if (!isPromise(required)) required = Promise.resolve(required);
    // validate if necessarily, and call next
    required.then(function (required) {
      if (validationId !== field._validationId) return;
      //
      // update field.required when this rule has property 'required'
      if (required != null) {
        field.required = Boolean(required);
      }
      //
      if (field.required || !empty(field.value)) {
        var isValid = rule.rule.handler(field.value, rule.params, field, validation.fields, validation, Vue);
        if (!isPromise(isValid)) isValid = isValid ? Promise.resolve() : Promise.reject();
        isValid.then(function () {
          if (validationId !== field._validationId) return;
          //
          subError(rule, field, validation);
          index++;
          next();
        }).catch(function () {
          if (validationId !== field._validationId) return;
          //
          addError(rule, field, validation);
          index++;
          next();
        });
      } else {
        index++;
        next();
      }
    });
  };
  end = function () {
    if (validationId !== field._validationId) return;
    // set state: validating of field
    field._validationId = null;
    field.validating = false;
    // set state: validating of validation
    validation.validating = Object.values(validation.fields).find(function (field) {
      return field.validating;
    }) != null;
  };
  next();
}
function addError(rule, field, validation) {
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
}
function subError(rule, field, validation) {
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
}
function subAllErrors(field, validation) {
  field.errors = {};
  // set state
  field.valid = true;
  validation.valid = Object.values(validation.fields).every(function (field) {
    return field.valid;
  });
}
function createValidation(name, fields, vm) {
  return {
    name: name,
    fields: fields,
    dirty: false,
    valid: false,
    validating: false,
    _sensitiveFields: [],
    vm: vm,
    getValues: function () {
      var values = {};
      for (var _iterator2 = Object.keys(this.fields), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var key = _ref2;

        values[key] = this.fields[key].value;
      }
      return values;
    },
    setValues: function (values) {
      for (var key in values) {
        if (this.fields.hasOwnProperty(key)) {
          this.fields[key].value = values[key];
        }
      }
    },
    setDirty: function (to) {
      this.dirty = to;
      Object.values(this.fields).forEach(function (v) {
        v.dirty = to;
      });
      return this;
    },
    check: function () {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.validating) {
          reject();
        } else if (!_this.valid) {
          _this.setDirty(true);
          reject();
        } else {
          resolve(_this.getValues());
        }
      });
    },
    pause: function () {
      Object.values(this.fields).forEach(function (field) {
        field.watcher && field.watcher.unwatch && field.watcher.unwatch();
      });
    },
    'continue': function () {
      var _this2 = this;

      Object.values(this.fields).forEach(function (field) {
        field.watcher && field.watcher.unwatch && field.watcher.unwatch();
        var watcher = field.watcher;
        watcher.unwatch = _this2.vm.$watch(watcher.path, watcher.handler);
      });
    },
    clear: function () {
      Object.values(this.fields).forEach(function (field) {
        field.watcher && field.watcher.unwatch && field.watcher.unwatch();
        field.required = false;
        field.dirty = false;
      });
      this.dirty = false;
    }
  };
}
function initFields(validation, vm) {
  var _loop = function (key) {
    var field = validation.fields[key];
    // necessarily property
    if (!field.name) vm.$set(field, 'name', key);
    if (typeof field.value === 'undefined') vm.$set(field, 'value', null);
    // add state to field
    vm.$set(field, 'dirty', false);
    vm.$set(field, 'valid', false);
    vm.$set(field, 'errors', {});
    vm.$set(field, 'required', false);
    vm.$set(field, 'validating', false);
    vm.$set(field, '_resolvedRules', resolveRules(field, vm.$validator));
    // find field has sensitive rule
    for (var _iterator3 = Object.values(field._resolvedRules), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var rule = _ref3;

      if (rule.rule.sensitive) {
        validation._sensitiveFields.push(field);
        break;
      }
    }
    // watcher
    var watcher = {
      path: function () {
        return field.value;
      },
      handler: function (val, newVal) {
        validateField(field, validation);
        field.dirty = true;
        validation.dirty = true;
        validation._sensitiveFields.filter(function (v) {
          return v !== field;
        }).forEach(function (v) {
          validateField(v, validation);
        });
      }
    };
    watcher.unwatch = vm.$watch(watcher.path, watcher.handler);
    vm.$set(field, 'watcher', watcher);
  };

  for (var key in validation.fields) {
    _loop(key);
  }
}
function resolveRules(field, validator) {
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
      var ruleObj = field.customRules && field.customRules[rule] || validator.options.rules[rule];
      if (typeof ruleObj === 'function') {
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
        rule: ruleObj,
        message: field.messages && field.messages[rule] || validator.options.messages && validator.options.messages[rule] || 'No error message for :name.'
      };
    }
  }
  return r;
}
// functions
function isPromise(v) {
  return Object.prototype.toString.call(v) === '[object Promise]';
}
function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}
function isBool(obj) {
  return Object.prototype.toString.call(obj) === '[object Boolean]';
}
function isObject(str) {
  return Object.prototype.toString.call(str) === '[object Object]';
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

// the asynchronous rules(remoteCheck...) need vue-resource
//
var rules = {
  accepted: function (val) {
    return val === 'yes' || val === 'on' || val === true || val === 1 || val === '1';
  },
  alpha: function (val) {
    return (/^[a-zA-Z]+$/.test(val)
    );
  },
  alphaDash: function (val) {
    return (/^[\w\-]+$/.test(val)
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
    return (/^\d\d\d\d\-\d\d?\-\d\d?$/.test(val)
    );
  },
  datetime: function (val) {
    return (/^\d\d\d\d\-\d\d?\-\d\d? \d\d?:\d\d?:\d\d?$/.test(val)
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
    return (/^\-?[1-9]\d*$/.test(val)
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
      return !empty$1(val);
    },
    required: true
  },
  requiredWith: {
    handler: function (val) {
      return !empty$1(val);
    },
    sensitive: true,
    required: function (val, params, field, fields) {
      return !empty$1(fields[params[0]].value);
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
  remoteNotExisted: function (val, params) {
    return rules.remoteCheck(val, params);
  }
};
//
var messages = {
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
//
var options = {
  rules: rules,
  messages: messages
};
// functions
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}
function isNumber$1(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function isBool$1(obj) {
  return Object.prototype.toString.call(obj) === '[object Boolean]';
}
function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}
function isObject$1(str) {
  return Object.prototype.toString.call(str) === '[object Object]';
}

function empty$1(v) {
  if (v == null) {
    return true;
  } else if (v.length != null) {
    return v.length === 0;
  } else if (isBool$1(v)) {
    return false;
  } else if (isNumber$1(v)) {
    return isNaN(v);
  } else if (isObject$1(v)) {
    return Object.keys(v).length === 0;
  }
}

var index = {
  validator: validator,
  options: options
};

module.exports = index;
