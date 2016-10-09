# if you use lodash, can remove this
_ = require './lodash.custom.coffee'
# functions
isset = (v) -> typeof v != 'undefined'
isBool = (v) -> Object.prototype.toString.call(v) == '[object Boolean]'
isString = (v) -> Object.prototype.toString.call(v) == '[object String]'
isNumber = (v) -> Object.prototype.toString.call(v) == '[object Number]'
isArray = (v) -> Object.prototype.toString.call(v) == '[object Array]'
isObject = (v) -> Object.prototype.toString.call(v) == '[object Object]'
isPromise = (v) -> Object.prototype.toString.call(v) == '[object Promise]'
empty = (v) ->
  if !isset(v) || v == null
    return true
  else if isset(v.length)
    return v.length == 0
  else if isBool(v) or isNumber(v)
    return false
  else if isNaN(v)
    return true
  else if isObject(v)
    i = 0
    i++ for k of v
    return i == 0
assignIfDifferently = (obj, key, value) ->
  if obj[key] isnt value then obj[key] = value

# module
module.exports = {
  install: (Vue, options) ->
    Vue.Validator = {
      options
    }
    Vue.prototype.$validate = (name, fields) ->
      # define functions
      resolveRules = (field) ->
        r = {}
        if field.rules
          rules = field.rules.split('|')
          for k of rules
            arr = rules[k].split(':')
            params = if arr[1] then arr[1].split(',') else []
            rule = arr[0]
            if field.ruleParams and field.ruleParams[rule]
              params = params.concat(field.ruleParams[rule])
            r[rule] =
              name: rule
              params: params
        return r
      validateField = (field) ->
        # sub functions
        validated = (valid) ->
          assignIfDifferently(field, 'valid', valid)
          # set validating state
          _.pull(validation._validatingQueue, queueId)
          assignIfDifferently(validation, 'validating', validation._validatingQueue.length > 0)
          # check is all valid
          if !valid
            assignIfDifferently(validation, 'valid', valid)
          else
            allValid = _.findIndex(_.values(fields), (field) -> !field.valid) is -1
            assignIfDifferently(validation, 'valid', allValid && !validation.validating)

        addError = (ruleName, message) ->
          errors = {}
          _.forIn(field._resolvedRules, (v, key) ->
            if _.has(field.errors, key)
              errors[key] = field.errors[key]
            if key == ruleName
              errors[ruleName] =
                name: ruleName
                message: message
          )
          field.errors = errors

        compileMessage = (rule) ->
          message = field.messages?[rule.name] or Vue.Validator.options.messages[rule.name] or 'No error message for :name.'
          nameInMessage = field.nameInMessage or field.text?.toString().toLowerCase() or field.name
          message = message.replace(/:name/g, nameInMessage)
          _.forIn(rule.params, (v, i) ->
            reg = new RegExp(':params\\[' + i + '\\]', 'g')
            message = message.replace(reg, rule.params[i])
          )
          return message
        # sub functions end

        # set validating state
        queueId = {}
        validation._validatingQueue.push(queueId)
        assignIfDifferently(validation, 'validating', true)
        #
        field.errors = {}
        _.forIn(field._resolvedRules, (rule) ->
          ruleObj = field.customRules?[rule.name] || Vue.Validator.options.rules[rule.name]
          ruleHandler = ruleObj.handler || ruleObj
          if ruleObj.always || !empty(field.value)
            valid = ruleHandler(field.value, rule.params, field, fields)
            valid = if isPromise(valid) then valid else (if valid then Promise.resolve() else Promise.reject())
            valid
            .then( ->  validated(true))
            .catch( ->
              validated(false)
              addError(rule.name, compileMessage(rule))
            )
        )

      # clear old validation
      oldValidation = this[name]
      if oldValidation? and oldValidation.clear? then oldValidation.clear()
      # create
      validation = {
        name,
        fields,
        dirty: false,
        valid: false,
        validating: false,
        _validatingQueue: [],
        # methods
        getValues: -> _.mapValues(this.fields, (v) -> v.value )
        setDirty: (to = true) ->
          _.forIn(this.fields, (v) -> assignIfDifferently(v, 'dirty', to))
          assignIfDifferently(this, 'dirty', to)
          return this
        check: ->
          return new Promise((resolve, reject) =>
            if this.validating then reject()
            else if !this.valid
              this.setDirty(true)
              reject()
            else resolve(this.getValues())
          )
        clear: ->
          _.forIn(this.fields, (v) -> v.watcher?.unwatch?())
          this.setDirty(false)
      }
      # attach validation to vm
      this[name] = validation
      #
      _.forIn(fields, (field, key) =>
        # add state to field
        Vue.set(field, 'dirty', false)
        Vue.set(field, 'valid', false)
        Vue.set(field, 'errors', {})
        Vue.set(field, 'required', false)
        Vue.set(field, '_resolvedRules', resolveRules(field))
        # find field has sensitive rule
        sensitiveFields = []
        _.forIn(field._resolvedRules, (rule) ->
          ruleObj = (field.customRules && field.customRules[rule.name]) || Vue.Validator.options.rules[rule.name]
          if ruleObj.sensitive
            sensitiveFields.push(field)
            return false
        )
        # init watcher
        watcher = {
          path: -> field.value
          # path: "#{validation.name}['fields']['#{field.name}']['value']",
          handler: (val, newVal) ->
            # validate field and set dirty
            validateField(field)
            assignIfDifferently(field, 'dirty', true)
            assignIfDifferently(validation, 'dirty', true)
            # validate sensitive fields
            _.forEach(sensitiveFields, (field) -> validateField(field))
        }
        watcher.unwatch = this.$watch(watcher.path, watcher.handler)
        Vue.set(field, 'watcher', watcher)
      )
      # validate all at first
      _.forIn(fields, (field) -> validateField(field))
    # helper method: generateFields
    if Vue.prototype.$generateFields?
      oldFunc = Vue.prototype.$generateFields
    Vue.generateFields = Vue.prototype.$generateFields = (fields) ->
      fields = oldFunc(fields) if oldFunc?
      for key, field of fields
        field.name = key
        field.value ?= null
      return fields
}
