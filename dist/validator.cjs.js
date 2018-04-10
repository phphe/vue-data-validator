/*!
 * vue-data-validator v2.2.10
 * (c) 2017-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
'use strict';

var helperJs = require('helper-js');

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
        return helperJs.objectMap(this.fields, function (item) {
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


      vm.$set(field, 'value', helperJs.isset(field.value) ? field.value : null); // attach states to field

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

        if (helperJs.isFunction(ruleObj)) {
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
      field.required = !helperJs.isFunction(rule.required) ? rule.required : rule.required({
        value: field.value,
        params: rule.params,
        field: field,
        fields: validation.fields,
        validation: validation,
        Vue: validation.vm.$root.constructor
      });
    } //


    return new Promise(function (resolve, reject) {
      if (field.required || !helperJs.empty(field.value)) {
        var isValid = rule.handler({
          value: field.value,
          params: rule.params,
          field: field,
          fields: validation.fields,
          validation: validation,
          Vue: validation.vm.$root.constructor
        });
        if (!helperJs.isPromise(isValid)) isValid = isValid ? Promise.resolve() : Promise.reject(new Error('invalid'));
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
  var message = helperJs.isFunction(rule.message) ? rule.message({
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

module.exports = validator;
