import {isset, isFunction, isPromise, objectMap, empty} from 'helper-js'
export default {
  rules: {},
  messages: {},
  validClass: 'has-success',
  invalidClass: 'has-error',
  validtingClass: '',
  // The following methods are not recommended
  install(Vue) {
    Vue.validator = Vue.prototype.$validator = this
    Vue.prototype.$validate = function (validation, fields) { return Vue.validator.validate(validation, fields, this) }
  },
  validate(validation, fields, vm) {
    // clear old watchers and reset states
    validation.clear && validation.clear()
    this.initValidation(validation, fields, vm)
    this.initFields(validation, vm)
    // validate all fields at first
    Object.values(fields).forEach(item => this.validateField(item, validation))
    return validation
  },
  initValidation(validation, fields, vm) {
    const defaultValidation = {
      fields: fields,
      dirty: false,
      valid: false,
      validating: false,
      _sensitiveFields: [],
      vm,
      isSubmitAble() { return this.valid && !this.validating },
      getValues() { return objectMap(this.fields, item => item.value) },
      setValues(values) {
        for (const key in values) {
          if (this.fields.hasOwnProperty(key)) {
            this.fields[key].value = values[key]
          }
        }
        return this
      },
      setDirty(to) {
        this.dirty = to
        Object.values(this.fields).forEach((v) => { v.dirty = to })
        return this
      },
      check() {
        return new Promise((resolve, reject) => {
          if (this.validating) {
            reject(new Error('Data is being validated'))
          } else if (!this.valid) {
            this.setDirty(true)
            reject(new Error('Data is invalid'))
          } else {
            resolve(this.getValues())
          }
        })
      },
      unwatch() {
        Object.values(this.fields).forEach((field) => {
          field.watcher && field.watcher.unwatch && field.watcher.unwatch()
        })
        return this
      },
      pause() {
        this.unwatch()
        return this
      },
      'continue'() {
        this.unwatch()
        Object.values(this.fields).forEach((field) => {
          const watcher = field.watcher
          watcher.unwatch = this.vm.$watch(watcher.getValue, watcher.handler)
        })
        return this
      },
      clear() {
        this.unwatch()
        this.setDirty(false)
        Object.values(this.fields).forEach((field) => {
          field.required = false
        })
        return this
      }
    }
    for (const key in defaultValidation) {
      vm.$set(validation, key, defaultValidation[key])
    }
  },
  initFields(validation, vm) {
    for (const key in validation.fields) {
      const field = validation.fields[key]
      // filed name
      if (!field.name) vm.$set(field, 'name', key)
      else if (field.name !== key) {
        throw Error('The field name must be same with its key.')
      }
      // field value
      if (!isset(field.value)) vm.$set(field, 'value', null)
      // attach states to field
      vm.$set(field, 'dirty', false)
      vm.$set(field, 'valid', false)
      vm.$set(field, 'errors', {})
      vm.$set(field, 'required', false)
      vm.$set(field, 'validating', false)
      vm.$set(field, '_resolvedRules', this.resolveRules(field))
      vm.$set(field, 'isValidationErrorsVisible', () => {
        return field.rules && !field.validating && field.dirty && !field.valid
      })
      vm.$set(field, 'getValidationClass', () => {
        if (field.rules && field.dirty) {
          if (field.validating) {
            return this.validatingClass
          } else {
            return field.valid ? this.validClass : this.invalidClass
          }
        }
        return null
      })
      // find field has sensitive rule
      const firstSensitiveRule = Object.values(field._resolvedRules).find(item => item.sensitive)
      if (firstSensitiveRule) validation._sensitiveFields.push(field)
      // watcher
      const watcher = {
        getValue() { return field.value },
        handler: (val) => {
          this.validateField(field, validation)
          field.dirty = true
          validation.dirty = true
          // validate other sensitive field
          validation._sensitiveFields
          .filter(item => item !== field)
          .forEach(item => {
            this.validateField(item, validation)
          })
        }
      }
      watcher.unwatch = vm.$watch(watcher.getValue, watcher.handler)
      vm.$set(field, 'watcher', watcher)
    }
  },
  resolveRules(field) {
    const r = {}
    if (field.rules) {
      const rules = field.rules.split('|')
      for (const k in rules) {
        // get params
        const arr = rules[k].split(':')
        let params = arr[1] ? arr[1].split(',') : []
        const rule = arr[0]
        if (field.ruleParams && field.ruleParams[rule]) {
          params = params.concat(field.ruleParams[rule])
        }
        // get rule obj
        let ruleObj = (field.customRules && field.customRules[rule]) || this.rules[rule]
        if (isFunction(ruleObj)) {
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
          required: ruleObj.required,
          sensitive: ruleObj.sensitive,
          handler: ruleObj.handler,
          message: (field.messages && field.messages[rule]) || (this.messages && this.messages[rule]) || 'No error message for :name.'
        }
      }
    }
    return r
  },
  validateField(field, validation) {
    //
    const validationId = {}
    field._validationId = validationId
    validation.validating = true
    field.validating = true
    this.removeFieldAllErrors(field, validation)
    //
    const rules = Object.values(field._resolvedRules)
    let queue = Promise.resolve(true)
    for (const rule of rules) {
      queue = queue.then(() => this.validateRule(rule, field, validation, validationId))
    }
    queue
    .then(() => true)
    .catch((error) => error.message !== 'expired')
    .then((completed) => {
      if (completed) {
        // set state: validating of field
        field._validationId = null
        field.validating = false
        // set state: validating of validation
        validation.validating = Object.values(validation.fields).some(field => field.validating)
      }
    })
  },
  validateRule(rule, field, validation, validationId) {
    //
    if (rule.required != null) {
      field.required = !isFunction(rule.required) ? rule.required : rule.required(field.value, rule.params, field, validation.fields, validation, validation.vm.$root.constructor)
    }
    //
    return new Promise((resolve, reject) => {
      if (field.required || !empty(field.value)) {
        let isValid = rule.handler(field.value, rule.params, field, validation.fields, validation, validation.vm.$root.constructor)
        if (!isPromise(isValid)) isValid = isValid ? Promise.resolve() : Promise.reject(new Error('invalid'))
        isValid.then(() => {
          if (validationId !== field._validationId) reject(new Error('expired'))
          //
          this.removeFieldError(rule, field, validation)
          resolve()
        }).catch((error) => {
          if (validationId !== field._validationId) reject(new Error('expired'))
          //
          this.addFieldError(rule, field, validation)
          reject(error)
        })
      } else {
        resolve()
      }
    })
  },
  addFieldError(rule, field, validation) {
    // compile message
    const nameInMessage = field.nameInMessage || (field.text && field.text.toString().toLowerCase()) || field.name || 'unnamed'
    let message = rule.message.replace(/:name/g, nameInMessage).replace(/:value/g, field.value)
    for (const i in rule.params) {
      const reg = new RegExp(':params\\[' + i + '\\]', 'g')
      message = message.replace(reg, rule.params[i])
    }
    // if error of this rule hasnt set yet, set it
    if (!field.errors[rule.name]) {
      const errors = {}
      for (const k in field._resolvedRules) {
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
  },
  removeFieldError(rule, field, validation) {
    const errors = {}
    for (const k in field.errors) {
      if (k !== rule.name) {
        errors[k] = field.errors[k]
      }
    }
    field.errors = errors
    // set state
    field.valid = Object.keys(field.errors).length === 0
    validation.valid = Object.values(validation.fields).every(field => field.valid)
  },
  removeFieldAllErrors(field, validation) {
    field.errors = {}
    // set state
    field.valid = true
    validation.valid = Object.values(validation.fields).every(field => field.valid)
  }
}
