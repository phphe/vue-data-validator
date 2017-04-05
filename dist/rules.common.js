/*!
 * vue-data-validator v2.0.6
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/vue-data-validator.git
 * Released under the MIT License.
 */

'use strict';

var helperJs = require('helper-js');

var rules = {
  accepted: function accepted(val) {
    return val === 'yes' || val === 'on' || val === true || val === 1 || val === '1';
  },
  alpha: function alpha(val) {
    return (/^[a-zA-Z]+$/.test(val)
    );
  },
  alphaDash: function alphaDash(val) {
    return (/^[\w-]+$/.test(val)
    );
  },
  alphaNum: function alphaNum(val) {
    return (/^[\w]+$/.test(val)
    );
  },
  between: function between(val, params) {
    return params[0] <= val && params[1] <= val;
  },
  boolean: function boolean(val) {
    return [true, false, 1, 0, '1', '0'].includes(val);
  },
  date: function date(val) {
    return (/^\d\d\d\d-\d\d?-\d\d?$/.test(val)
    );
  },
  datetime: function datetime(val) {
    return (/^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(val)
    );
  },
  different: {
    handler: function handler(val, params, field, fields) {
      var relatedField = fields[params[0]];
      return val !== relatedField.value;
    },
    sensitive: true
  },
  email: function email(val) {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    );
  },
  in: function _in(val, params) {
    var list = helperJs.isArray(params[0]) ? params[0] : params;
    return list.indexOf(val) > -1;
  },
  integer: function integer(val) {
    return (/^-?[1-9]\d*$/.test(val)
    );
  },
  length: function length(val, params) {
    return (val || '').toString().length === parseInt(params[0]);
  },
  lengthBetween: function lengthBetween(val, params) {
    var len = (val || '').toString().length;
    return params[0] <= len && len <= params[1];
  },
  max: function max(val, params) {
    return val <= params[0];
  },
  maxLength: function maxLength(val, params) {
    return (val || '').toString().length <= params[0];
  },
  min: function min(val, params) {
    return val >= params[0];
  },
  minLength: function minLength(val, params) {
    return (val || '').toString().length >= params[0];
  },
  notIn: function notIn(val, params) {
    var list = helperJs.isArray(params[0]) ? params[0] : params;
    return list.indexOf(val) === -1;
  },
  numeric: function numeric(val) {
    return helperJs.isNumeric(val);
  },
  required: {
    handler: function handler(val, params, field) {
      return !helperJs.empty(val);
    },
    required: true
  },
  requiredWith: {
    handler: function handler(val) {
      return !helperJs.empty(val);
    },
    sensitive: true,
    required: function required(val, params, field, fields) {
      return !helperJs.empty(fields[params[0]].value);
    }
  },
  same: {
    handler: function handler(val, params, field, fields) {
      var relatedField = fields[params[0]];
      return val === relatedField.value;
    },
    sensitive: true
  },
  size: function size(val, params) {
    return (val || '').toString().length === parseInt(params[0]);
  },
  string: function string(val) {
    return helperJs.isString(val);
  },
  // asynchronous rules
  // Vue.http must be available
  remoteCheck: function remoteCheck(val, params, field, fields, validation, Vue) {
    if (typeof params[1] !== 'undefined') {
      var expected = helperJs.isArray(params[1]) ? params[1] : [params[1]];
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
  remoteNotExisted: function remoteNotExisted(val, params, field, fields, validation, Vue) {
    return this.remoteCheck(val, params, field, fields, validation, Vue);
  }
};

module.exports = rules;
