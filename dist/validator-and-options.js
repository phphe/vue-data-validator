/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// module.exports.validator = require('./src/vue-data-validator.coffee');
	// module.exports.options = require('./src/vue-data-validator-options.coffee');
	module.exports = {
	  validator:__webpack_require__(3)
	}


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  pull: function(arr, v) {
	    var index;
	    index = arr.indexOf(v);
	    if (index > -1) {
	      return arr.splice(index, 1);
	    } else {
	      return false;
	    }
	  },
	  values: function(obj) {
	    var j, len, v, values;
	    values = [];
	    for (j = 0, len = obj.length; j < len; j++) {
	      v = obj[j];
	      values.push(v);
	    }
	    return values;
	  },
	  findIndex: function(arr, cb) {
	    var k, key, v;
	    key = -1;
	    for (k in arr) {
	      v = arr[k];
	      if (cb(v, k)) {
	        key = k;
	        break;
	      }
	    }
	    return k;
	  },
	  has: function(obj, k) {
	    return obj.hasOwnProperty(k);
	  },
	  mapValues: function(obj, cb) {
	    var k, v, values;
	    values = {};
	    for (k in obj) {
	      v = obj[k];
	      values[k] = cbj(v, k);
	    }
	    return values;
	  },
	  forEach: function(arr, cb) {
	    var k, v;
	    for (k in arr) {
	      v = arr[k];
	      cb(v, k);
	    }
	  },
	  forIn: function(obj, cb) {
	    var i, k, r, v;
	    i = 0;
	    for (k in obj) {
	      v = obj[k];
	      r = cb(v, k, i);
	      i++;
	      if (r === false) {
	        break;
	      }
	    }
	  }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _, assignIfDifferently, empty, isArray, isBool, isNumber, isObject, isPromise, isString, isset;

	_ = __webpack_require__(2);

	isset = function(v) {
	  return typeof v !== 'undefined';
	};

	isBool = function(v) {
	  return Object.prototype.toString.call(v) === '[object Boolean]';
	};

	isString = function(v) {
	  return Object.prototype.toString.call(v) === '[object String]';
	};

	isNumber = function(v) {
	  return Object.prototype.toString.call(v) === '[object Number]';
	};

	isArray = function(v) {
	  return Object.prototype.toString.call(v) === '[object Array]';
	};

	isObject = function(v) {
	  return Object.prototype.toString.call(v) === '[object Object]';
	};

	isPromise = function(v) {
	  return Object.prototype.toString.call(v) === '[object Promise]';
	};

	empty = function(v) {
	  var i, j, len, v2;
	  if (!isset(v) || v === null) {
	    return true;
	  } else if (isset(v.length)) {
	    return v.length === 0;
	  } else if (isBool(v) || isNumber(v)) {
	    return false;
	  } else if (isNaN(v)) {
	    return true;
	  } else if (isObject(v)) {
	    i = 0;
	    for (j = 0, len = v.length; j < len; j++) {
	      v2 = v[j];
	      i++;
	    }
	    return i === 0;
	  }
	};

	assignIfDifferently = function(obj, key, value) {
	  if (obj[key] !== value) {
	    return obj[key] = value;
	  }
	};

	module.exports = {
	  install: function(Vue, options) {
	    Vue.Validator = {
	      options: options
	    };
	    return Vue.prototype.$validate = function(name, fields) {
	      var oldValidation, resolveRules, validateField, validation;
	      resolveRules = function(field) {
	        var arr, k, params, r, rule, rules;
	        r = {};
	        if (field.rules) {
	          rules = field.rules.split('|');
	          for (k in rules) {
	            arr = rules[k].split(':');
	            params = arr[1] ? arr[1].split(',') : [];
	            rule = arr[0];
	            if (field.ruleParams && field.ruleParams[rule]) {
	              params = params.concat(field.ruleParams[rule]);
	            }
	            r[rule] = {
	              name: rule,
	              params: params
	            };
	          }
	        }
	        return r;
	      };
	      validateField = function(field) {
	        var addError, compileMessage, queueId, validated;
	        validated = function(valid) {
	          var allValid;
	          assignIfDifferently(field, 'valid', valid);
	          _.pull(validation._validatingQueue, queueId);
	          assignIfDifferently(validation, 'validating', validation._validatingQueue.length > 0);
	          if (!valid) {
	            return assignIfDifferently(validation, 'valid', valid);
	          } else {
	            allValid = _.findIndex(_.values(fields), function(field) {
	              return !field.valid;
	            }) === -1;
	            return assignIfDifferently(validation, 'valid', allValid && !validation.validating);
	          }
	        };
	        addError = function(ruleName, message) {
	          var errors;
	          errors = {};
	          _.forIn(field._resolvedRules, function(v, key) {
	            if (_.has(field.errors, key)) {
	              return errors[key] = field.errors[key];
	            } else if (key === ruleName) {
	              return errors[ruleName] = {
	                name: ruleName,
	                message: message
	              };
	            }
	          });
	          return field.errors = errors;
	        };
	        compileMessage = function(rule) {
	          var message, nameInMessage, ref, ref1;
	          message = ((ref = field.messages) != null ? ref[rule.name] : void 0) || options.messages[rule.name] || 'No error message for :name.';
	          nameInMessage = field.nameInMessage || ((ref1 = field.text) != null ? ref1.toString().toLowerCase() : void 0) || field.name;
	          message = message.replace(/:name/g, nameInMessage);
	          _.forIn(rule.params, function(v, i) {
	            var reg;
	            reg = new RegExp(':params\\[' + i + '\\]', 'g');
	            return message = message.replace(reg, rule.params[i]);
	          });
	          return message;
	        };
	        queueId = {};
	        validation._validatingQueue.push(queueId);
	        assignIfDifferently(validation, 'validating', true);
	        field.errors = {};
	        return _.forIn(field._resolvedRules, function(rule) {
	          var ref, ruleHandler, ruleObj, valid;
	          ruleObj = ((ref = field.customRules) != null ? ref[rule.name] : void 0) || options.rules[rule.name];
	          ruleHandler = ruleObj.handler || ruleObj;
	          if (ruleObj.always || !empty(field.value)) {
	            valid = ruleHandler(field.value, rule.params, field, fields);
	            valid = isPromise(valid) ? valid : (valid ? Promise.resolve() : Promise.reject());
	            return valid.then(function() {
	              return validated(true);
	            })["catch"](function() {
	              validated(false);
	              return addError(rule.name, compileMessage(rule));
	            });
	          }
	        });
	      };
	      oldValidation = this[name];
	      if ((oldValidation != null) && (oldValidation.clear != null)) {
	        oldValidation.clear();
	      }
	      validation = {
	        name: name,
	        fields: fields,
	        dirty: false,
	        valid: false,
	        validating: false,
	        _validatingQueue: [],
	        getValues: function() {
	          return _.mapValues(this.fields, function(v) {
	            return v.value;
	          });
	        },
	        setDirty: function(to) {
	          if (to == null) {
	            to = true;
	          }
	          _.forIn(this.fields, function(v) {
	            return assignIfDifferently(v, 'dirty', to);
	          });
	          assignIfDifferently(this, 'dirty', to);
	          return this;
	        },
	        check: function() {
	          return new Promise((function(_this) {
	            return function(resolve, reject) {
	              if (_this.validating) {
	                return reject();
	              } else if (!_this.valid) {
	                _this.setDirty(true);
	                return reject();
	              } else {
	                return resolve(_this.getValues());
	              }
	            };
	          })(this));
	        },
	        clear: function() {
	          _.forIn(this.fields, function(v) {
	            var ref;
	            return (ref = v.watcher) != null ? typeof ref.unwatch === "function" ? ref.unwatch() : void 0 : void 0;
	          });
	          return this.setDirty(false);
	        }
	      };
	      this[name] = validation;
	      _.forIn(fields, (function(_this) {
	        return function(field, key) {
	          var sensitiveFields, watcher;
	          Vue.set(field, 'dirty', false);
	          Vue.set(field, 'valid', false);
	          Vue.set(field, 'errors', {});
	          Vue.set(field, 'required', false);
	          Vue.set(field, '_resolvedRules', resolveRules(field));
	          sensitiveFields = [];
	          _.forIn(field._resolvedRules, function(rule) {
	            var ruleObj;
	            ruleObj = (field.customRules && field.customRules[rule.name]) || options.rules[rule.name];
	            if (ruleObj.sensitive) {
	              sensitiveFields.push(field);
	              return false;
	            }
	          });
	          watcher = {
	            path: function() {
	              return field.value;
	            },
	            handler: function(val, newVal) {
	              validateField(field);
	              assignIfDifferently(field, 'dirty', true);
	              assignIfDifferently(validation, 'dirty', true);
	              return _.forEach(sensitiveFields, function(field) {
	                return validateField(field);
	              });
	            }
	          };
	          watcher.unwatch = _this.$watch(watcher.path, watcher.handler);
	          return Vue.set(field, 'watcher', watcher);
	        };
	      })(this));
	      return _.forIn(fields, function(field) {
	        return validateField(field);
	      });
	    };
	  }
	};


/***/ }
/******/ ]);