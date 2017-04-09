import {isArray, isString, isNumeric, empty} from 'helper-js'
const rules = {
  accepted(val) {
    return val === 'yes' || val === 'on' || val === true || val === 1 || val === '1'
  },
  alpha(val) {
    return /^[a-zA-Z]+$/.test(val)
  },
  alphaDash(val) {
    return /^[\w-]+$/.test(val)
  },
  alphaNum(val) {
    return /^[\w]+$/.test(val)
  },
  between(val, params) {
    return params[0] <= val && params[1] <= val
  },
  boolean(val) {
    return [true, false, 1, 0, '1', '0'].includes(val)
  },
  date(val) {
    return /^\d\d\d\d-\d\d?-\d\d?$/.test(val)
  },
  datetime(val) {
    return /^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(val)
  },
  different: {
    handler(val, params, field, fields) {
      const relatedField = fields[params[0]]
      return val !== relatedField.value
    },
    sensitive: true
  },
  email(val) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
  },
  in(val, params) {
    const list = isArray(params[0]) ? params[0] : params
    return list.indexOf(val) > -1
  },
  integer(val) {
    return /^-?[1-9]\d*$/.test(val)
  },
  length(val, params) {
    return (val || '').toString().length === parseInt(params[0])
  },
  lengthBetween(val, params) {
    const len = (val || '').toString().length
    return (params[0] <= len && len <= params[1])
  },
  max(val, params) {
    return val <= params[0]
  },
  maxLength(val, params) {
    return (val || '').toString().length <= params[0]
  },
  min(val, params) {
    return val >= params[0]
  },
  minLength(val, params) {
    return (val || '').toString().length >= params[0]
  },
  notIn(val, params) {
    const list = isArray(params[0]) ? params[0] : params
    return list.indexOf(val) === -1
  },
  numeric(val) {
    return isNumeric(val)
  },
  regex(val, params) {
    const reg = isString(params[0]) ? new RegExp(params[0]) : params[0]
    return reg.test(val)
  },
  required: {
    handler(val, params, field) {
      return !empty(val)
    },
    required: true
  },
  requiredWith: {
    handler(val) {
      return !empty(val)
    },
    sensitive: true,
    required(val, params, field, fields) {
      return !empty(fields[params[0]].value)
    }
  },
  same: {
    handler(val, params, field, fields) {
      const relatedField = fields[params[0]]
      return val === relatedField.value
    },
    sensitive: true
  },
  size(val, params) {
    return (val || '').toString().length === parseInt(params[0])
  },
  string(val) {
    return isString(val)
  },
  // asynchronous rules
  // Vue.http must be available
  remoteCheck(val, params, field, fields, validation, Vue) {
    const expected = isArray(params[1]) ? params[1] : [params[1]]
    if (expected.includes(val)) {
      return true
    }
    const url = params[0]
    return Vue.http.post(url, { value: val })
    .then(({data}) => {
      return data ? Promise.resolve() : Promise.reject(new Error('invalid'))
    })
  },
  remoteNotExisted (val, params, field, fields, validation, Vue) {
    return rules.remoteCheck(val, params, field, fields, validation, Vue)
  }
}
export default rules
