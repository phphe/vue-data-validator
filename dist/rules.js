/*!
 * vue-data-validator v2.0.1
 * phphe
 * https://github.com/phphe/vue-data-validator.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.vueDataValidatorRules = global.vueDataValidatorRules || {}, global.vueDataValidatorRules.js = factory());
}(this, (function () { 'use strict';

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

return rules;

})));
