/*!
 * vue-data-validator v2.2.5
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/vue-data-validator.git
 * Released under the MIT License.
 */

import { empty, isArray, isNumeric, isString } from 'helper-js';

var rules = {
  accepted: function accepted(_ref) {
    var value = _ref.value;

    return value === 'yes' || value === 'on' || value === true || value === 1 || value === '1';
  },
  alpha: function alpha(_ref2) {
    var value = _ref2.value;

    return (/^[a-zA-Z]+$/.test(value)
    );
  },
  alphaDash: function alphaDash(_ref3) {
    var value = _ref3.value;

    return (/^[\w-]+$/.test(value)
    );
  },
  alphaNum: function alphaNum(_ref4) {
    var value = _ref4.value;

    return (/^[\w]+$/.test(value)
    );
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

    return (/^\d\d\d\d-\d\d?-\d\d?$/.test(value)
    );
  },
  datetime: function datetime(_ref8) {
    var value = _ref8.value;

    return (/^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(value)
    );
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

    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
    );
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
  max: function max(_ref15) {
    var value = _ref15.value,
        params = _ref15.params;

    return value <= params[0];
  },
  maxLength: function maxLength(_ref16) {
    var value = _ref16.value,
        params = _ref16.params;

    return (value || '').length <= params[0];
  },
  min: function min(_ref17) {
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
    return Vue.http.post(url, { value: value }).then(function (_ref30) {
      var data = _ref30.data;

      return data ? Promise.resolve() : Promise.reject(new Error('invalid'));
    });
  },
  remoteNotExisted: function remoteNotExisted(obj) {
    return rules.remoteCheck(obj);
  }
};

export default rules;
