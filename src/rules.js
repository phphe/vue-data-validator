import {isArray, isString, isNumeric, empty} from 'helper-js'
export default {
  accepted: function(val) {
    return val === 'yes' || val === 'on' || val === true || val === 1 || val === '1'
  },
  alpha: function(val) {
    return /^[a-zA-Z]+$/.test(val)
  },
  alphaDash: function(val) {
    return /^[\w-]+$/.test(val)
  },
  alphaNum: function(val) {
    return /^[\w]+$/.test(val)
  },
  between: function(val, params) {
    return params[0] <= val && params[1] <= val
  },
  boolean: function(val) {
    return [true, false, 1, 0, '1', '0'].includes(val)
  },
  date: function(val) {
    return /^\d\d\d\d-\d\d?-\d\d?$/.test(val)
  },
  datetime: function(val) {
    return /^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(val)
  },
  different: {
    handler: function(val, params, field, fields) {
      const relatedField = fields[params[0]]
      return val !== relatedField.value
    },
    sensitive: true
  },
  email: function(val) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
  },
  in: function(val, params) {
    const list = isArray(params[0]) ? params[0] : params
    return list.indexOf(val) > -1
  },
  integer: function(val) {
    return /^-?[1-9]\d*$/.test(val)
  },
  length: function(val, params) {
    return (val || '').toString().length === parseInt(params[0])
  },
  lengthBetween: function(val, params) {
    const len = (val || '').toString().length
    return (params[0] <= len && len <= params[1])
  },
  max: function(val, params) {
    return val <= params[0]
  },
  maxLength: function(val, params) {
    return (val || '').toString().length <= params[0]
  },
  min: function(val, params) {
    return val >= params[0]
  },
  minLength: function(val, params) {
    return (val || '').toString().length >= params[0]
  },
  notIn: function(val, params) {
    const list = isArray(params[0]) ? params[0] : params
    return list.indexOf(val) === -1
  },
  numeric: function(val) {
    return isNumeric(val)
  },
  required: {
    handler: function(val, params, field) {
      return !empty(val)
    },
    required: true
  },
  requiredWith: {
    handler: function(val) {
      return !empty(val)
    },
    sensitive: true,
    required: function(val, params, field, fields) {
      return !empty(fields[params[0]].value)
    }
  },
  same: {
    handler: function(val, params, field, fields) {
      const relatedField = fields[params[0]]
      return val === relatedField.value
    },
    sensitive: true
  },
  size: function(val, params) {
    return (val || '').toString().length === parseInt(params[0])
  },
  string: function(val) {
    return isString(val)
  },
  // asynchronous rules
  // Vue.http must be available
  remoteCheck: function(val, params, field, fields, validation, Vue) {
    if (typeof params[1] !== 'undefined') {
      const expected = isArray(params[1]) ? params[1] : [params[1]]
      if (expected.indexOf(val) > -1) {
        return true
      }
    }
    return new Promise(function(resolve, reject) {
      const url = params[0].replace(/:value/g, val)
      return Vue.http.get(url).then(function(resp) {
        if (resp.data === true || resp.data === 1 || resp.data === 'true') {
          resolve(resp.data, resp.status, resp)
        } else {
          reject(resp.data, resp.status, resp)
        }
      }).catch(function(resp) {
        reject(resp.data, resp.status, resp)
      })
    })
  },
  remoteNotExisted: function (val, params, field, fields, validation, Vue) {
    return this.remoteCheck(val, params, field, fields, validation, Vue)
  }
}
