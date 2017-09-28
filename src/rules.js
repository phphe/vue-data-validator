import {isArray, isString, isNumeric, empty} from 'helper-js'
const rules = {
  accepted({value}) {
    return value === 'yes' || value === 'on' || value === true || value === 1 || value === '1'
  },
  alpha({value}) {
    return /^[a-zA-Z]+$/.test(value)
  },
  alphaDash({value}) {
    return /^[\w-]+$/.test(value)
  },
  alphaNum({value}) {
    return /^[\w]+$/.test(value)
  },
  between({value, params}) {
    return params[0] <= value && params[1] <= value
  },
  boolean({value}) {
    return [true, false, 1, 0, '1', '0'].includes(value)
  },
  date({value}) {
    return /^\d\d\d\d-\d\d?-\d\d?$/.test(value)
  },
  datetime({value}) {
    return /^\d\d\d\d-\d\d?-\d\d? \d\d?:\d\d?:\d\d?$/.test(value)
  },
  different: {
    handler({value, params, field, fields}) {
      const relatedField = fields[params[0]]
      return value !== relatedField.value
    },
    sensitive: true
  },
  email({value}) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
  },
  in({value, params}) {
    const list = isArray(params[0]) ? params[0] : params
    return list.indexOf(value) > -1
  },
  integer({value}) {
    const reg = /^\-?\d+$/
    return reg.test(value)
  },
  length({value, params}) {
    return (value || '').toString().length === parseInt(params[0])
  },
  lengthBetween({value, params}) {
    const len = (value || '').toString().length
    return (params[0] <= len && len <= params[1])
  },
  max({value, params}) {
    return value <= params[0]
  },
  maxLength({value, params}) {
    return (value || '').toString().length <= params[0]
  },
  min({value, params}) {
    return value >= params[0]
  },
  minLength({value, params}) {
    return (value || '').toString().length >= params[0]
  },
  notIn({value, params}) {
    const list = isArray(params[0]) ? params[0] : params
    return list.indexOf(value) === -1
  },
  numeric({value}) {
    return isNumeric(value)
  },
  regex({value, params}) {
    const reg = isString(params[0]) ? new RegExp(params[0]) : params[0]
    return reg.test(value)
  },
  required: {
    handler({value, params, field}) {
      return !empty(value)
    },
    required: true
  },
  requiredWith: {
    handler({value}) {
      return !empty(value)
    },
    sensitive: true,
    required({value, params, field, fields}) {
      return !empty(fields[params[0]].value)
    }
  },
  same: {
    handler({value, params, field, fields}) {
      const relatedField = fields[params[0]]
      return value === relatedField.value
    },
    sensitive: true
  },
  size({value, params}) {
    return (value || '').toString().length === parseInt(params[0])
  },
  string({value}) {
    return isString(value)
  },
  // asynchronous rules
  // Vue.http must be available
  remoteCheck({value, params, field, fields, validation, Vue}) {
    const expected = isArray(params[1]) ? params[1] : [params[1]]
    if (expected.includes(value)) {
      return true
    }
    const url = params[0]
    return Vue.http.post(url, { value: value })
    .then(({data}) => {
      return data ? Promise.resolve() : Promise.reject(new Error('invalid'))
    })
  },
  remoteNotExisted (obj) {
    return rules.remoteCheck(obj)
  }
}
export default rules
