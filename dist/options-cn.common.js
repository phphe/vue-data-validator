/*!
 * vue-data-validator v1.2.4
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
  remoteNotExisted: function (val, params) {
    return rules.remoteCheck(val, params);
  }
};
//
var messages = {
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
