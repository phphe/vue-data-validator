/*!
 * vue-data-validator v1.2.8
 * https://github.com/phphe/vue-data-validator
 * Released under the MIT License.
 */

'use strict';

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
    return rules.remoteCheck(val, params, field, fields, validation, Vue);
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
function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]';
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function isBool(obj) {
  return Object.prototype.toString.call(obj) === '[object Boolean]';
}
function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
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

module.exports = options;
