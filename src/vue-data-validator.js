var Vue
var validator = {
  options: {},
  add(rules, messages) {
    if (!messages) messages = {}
    Object.assign(validator.options.rules, rules)
    Object.assign(validator.options.messages, messages)
  },
  install(Vue2, options) {
    Vue = Vue2
    Vue.validator = Vue.prototype.$validator = validator
    if (options) validator.options = options
    Vue.prototype.$validate = function (name, fields) { return validate(name, fields, this) }
  }
}
export default validator
function validate(name, fields, vm) {
  // clear old validation
  vm[name] && vm[name].clear && vm[name].clear()
  // create
  let validation = createValidation(name, fields, vm)
  // attach validation to vm
  vm[name] = validation
  //
  initFields(validation, vm)
  // validate at first
  for (let field of Object.values(fields)) {
    validateField(field, validation)
  }
}
function validateField(field, validation) {
  //
  let validationId = {}
  field._validationId = validationId
  validation.validating = true
  field.validating = true
  //
  subAllErrors(field, validation)
  //
  let rules = Object.values(field._resolvedRules)
  let index = 0
  let next, end
  next = () => {
    if (validationId !== field._validationId) return
    //
    let rule = rules[index]
    if (!rule) return end()
    // wrap required to promise
    let isRequired = rule.rule.required
    let required = field.required
    if (isRequired != null) {
      if (typeof isRequired !== 'function') isRequired = () => rule.rule.required
      required = isRequired(field.value, rule.params, field, validation.fields, validation, Vue)
    }
    if (!isPromise(required)) required = Promise.resolve(required)
    // validate if necessarily, and call next
    required.then((required) => {
      if (validationId !== field._validationId) return
      //
      // update field.required when this rule has property 'required'
      if (required != null) {
        field.required = Boolean(required)
      }
      //
      if (field.required || !empty(field.value)) {
        let isValid = rule.rule.handler(field.value, rule.params, field, validation.fields, validation, Vue)
        if (!isPromise(isValid)) isValid = isValid ? Promise.resolve() : Promise.reject()
        isValid.then(() => {
          if (validationId !== field._validationId) return
          //
          subError(rule, field, validation)
          index++
          next()
        }).catch(() => {
          if (validationId !== field._validationId) return
          //
          addError(rule, field, validation)
          index++
          next()
        })
      } else {
        index++
        next()
      }
    })
  }
  end = () => {
    if (validationId !== field._validationId) return
    // set state: validating of field
    field._validationId = null
    field.validating = false
    // set state: validating of validation
    validation.validating = Object.values(validation.fields).find(field => field.validating) != null
  }
  next()
}
function addError(rule, field, validation) {
  // compile message
  let nameInMessage = field.nameInMessage || field.text && field.text.toString().toLowerCase() || field.name || 'unnamed'
  let message = rule.message.replace(/:name/g, nameInMessage).replace(/:value/g, field.value)
  for (let i in rule.params) {
    let reg = new RegExp(':params\\[' + i + '\\]', 'g')
    message = message.replace(reg, rule.params[i])
  }
  // if error of this rule hasnt set yet, set it
  if (!field.errors[rule.name]) {
    let errors = {}
    for (let k in field._resolvedRules) {
      if (field.errors[k]) {
        errors[k] = field.errors[k]
      } else if (k === rule.name) {
        errors[k] = {}
      }
    }
    field.errors = errors
  }
  // set error
  field.errors[rule.name] = {
    name: rule.name,
    message: message
  }
  // set state
  field.valid = false
  validation.valid = false
}
function subError(rule, field, validation) {
  let errors = {}
  for (let k in field.errors) {
    if (k !== rule.name) {
      errors[k] = field.errors[k]
    }
  }
  field.errors = errors
  // set state
  field.valid = Object.keys(field.errors).length === 0
  validation.valid = Object.values(validation.fields).every(field => field.valid)
}
function subAllErrors(field, validation) {
  field.errors = {}
  // set state
  field.valid = true
  validation.valid = Object.values(validation.fields).every(field => field.valid)
}
function createValidation(name, fields, vm) {
  return {
    name: name,
    fields: fields,
    dirty: false,
    valid: false,
    validating: false,
    _sensitiveFields: [],
    vm,
    getValues() {
      let values = {}
      for (let key of Object.keys(this.fields)) {
        values[key] = this.fields[key].value
      }
      return values
    },
    setValues(values) {
      for (let key in values) {
        if (this.fields.hasOwnProperty(key)) {
          this.fields[key].value = values[key]
        }
      }
    },
    setDirty(to) {
      this.dirty = to
      Object.values(this.fields).forEach((v) => { v.dirty = to })
      return this
    },
    check() {
      return new Promise((resolve, reject) => {
        if (this.validating) {
          reject()
        } else if (!this.valid) {
          this.setDirty(true)
          reject()
        } else {
          resolve(this.getValues())
        }
      })
    },
    pause() {
      Object.values(this.fields).forEach((field) => {
        field.watcher && field.watcher.unwatch && field.watcher.unwatch()
      })
    },
    'continue'() {
      Object.values(this.fields).forEach((field) => {
        field.watcher && field.watcher.unwatch && field.watcher.unwatch()
        let watcher = field.watcher
        watcher.unwatch = this.vm.$watch(watcher.path, watcher.handler)
      })
    },
    clear() {
      Object.values(this.fields).forEach((field) => {
        field.watcher && field.watcher.unwatch && field.watcher.unwatch()
        field.required = false
        field.dirty = false
      })
      this.dirty = false
    }
  }
}
function initFields(validation, vm) {
  for (let key in validation.fields) {
    let field = validation.fields[key]
    // necessarily property
    if (!field.name) vm.$set(field, 'name', key)
    if (typeof field.value === 'undefined') vm.$set(field, 'value', null)
    // add state to field
    vm.$set(field, 'dirty', false)
    vm.$set(field, 'valid', false)
    vm.$set(field, 'errors', {})
    vm.$set(field, 'required', false)
    vm.$set(field, 'validating', false)
    vm.$set(field, '_resolvedRules', resolveRules(field, vm.$validator))
    // find field has sensitive rule
    for (let rule of Object.values(field._resolvedRules)) {
      if (rule.rule.sensitive) {
        validation._sensitiveFields.push(field)
        break
      }
    }
    // watcher
    let watcher = {
      path() { return field.value },
      handler(val, newVal) {
        validateField(field, validation)
        field.dirty = true
        validation.dirty = true
        validation._sensitiveFields.filter(v => v !== field).forEach(v => {
          validateField(v, validation)
        })
      }
    }
    watcher.unwatch = vm.$watch(watcher.path, watcher.handler)
    vm.$set(field, 'watcher', watcher)
  }
}
function resolveRules(field, validator) {
  let r = {}
  if (field.rules) {
    let rules = field.rules.split('|')
    for (let k in rules) {
      // get params
      let arr = rules[k].split(':')
      let params = arr[1] ? arr[1].split(',') : []
      let rule = arr[0]
      if (field.ruleParams && field.ruleParams[rule]) {
        params = params.concat(field.ruleParams[rule])
      }
      // get rule obj
      let ruleObj = field.customRules && field.customRules[rule] || validator.options.rules[rule]
      if (typeof ruleObj === 'function') {
        ruleObj = {
          handler: ruleObj
        }
      }
      if (ruleObj == null) {
        throw Error(`Rule '${rule}' of field '${field.name}' is not found.`)
      }
      // result
      r[rule] = {
        name: rule,
        params: params,
        //
        rule: ruleObj,
        message: field.messages && field.messages[rule] || validator.options.messages && validator.options.messages[rule] || 'No error message for :name.'
      }
    }
  }
  return r
}
// functions
function isPromise(v) {
  return Object.prototype.toString.call(v) === '[object Promise]'
}
function isNumber(obj) {
  return Object.prototype.toString.call(obj) === '[object Number]'
}
function isBool(obj) {
  return Object.prototype.toString.call(obj) === '[object Boolean]'
}
function isObject(str) {
  return Object.prototype.toString.call(str) === '[object Object]'
}

function empty(v) {
  if (v == null) {
    return true
  } else if (v.length != null) {
    return v.length === 0
  } else if (isBool(v)) {
    return false
  } else if (isNumber(v)) {
    return isNaN(v)
  } else if (isObject(v)) {
    return Object.keys(v).length === 0
  }
}
