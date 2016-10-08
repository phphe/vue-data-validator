# if you use lodash, can remove this
_ = require './lodash.custom.coffee'
# functons
isset = (v) -> typeof v != 'undefined'
isBool = (v) -> Object.prototype.toString.call(v) == '[object Boolean]'
isString = (v) -> Object.prototype.toString.call(v) == '[object String]'
isNumber = (v) -> Object.prototype.toString.call(v) == '[object Number]'
isArray = (v) -> Object.prototype.toString.call(v) == '[object Array]'
isObject = (v) -> Object.prototype.toString.call(v) == '[object Object]'
isPromise = (v) -> Object.prototype.toString.call(v) == '[object Promise]'
isNumeric = (v) ->
  num = parseFloat(v)
  return !isNaN(num) && isNumber(num)
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
    i++ for v2 in v
    return i == 0
assignIfDifferently = (obj, key, value) ->
  if obj[key] isnt value then obj[key] = value

# module
module.exports = {
  rules: {
    accepted: (val) -> val is 'yes' || val is 'on' || val is true || val is 1 || val is '1',
    # todo: active_url
    # todo: after:date#
    alpha: (val) -> /^[a-zA-Z]+$/.test(val),
    alphaDash: (val) -> /^[\w\-]+$/.test(val),
    alphaNum: (val) -> /^[\w]+$/.test(val),
    array: (val) -> isArray(val),
    # todo: before:date
    # the rule is different with Laravel
    between: (val, params) -> params[0] <= val && params[1] <= val,
    boolean: (val) -> [true, false, 1, 0, '1', '0'].includes(val),
    confirmed: {
      handler: (val, params, field, fields) ->
        relatedField = fields["#{field.name}Confirmation"]
        return val is relatedField.value
      ,
      sensitive: true
    },
    date: (val) -> /^\d\d\d\d\-\d\d?\-\d\d? \d\d?:\d\d?:\d\d?$/.test(val),
    # todo: date_format:format
    different: {
      handler: (val, params, field, fields) ->
        relatedField = fields[params[0]]
        return val isnt relatedField.value
      ,
      sensitive: true
    },
    # todo: digits
    # todo: digits_between
    email: (val) ->
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    ,
    # todo: exists:table,column
    # todo: image
    in: (val, params) ->
      list = if isArray(params[0]) then params[0] else params
      return list.indexOf(val) > -1
    ,
    integer: (val) -> /^\-?[1-9]\d*$/.test(val),
    # todo: ip
    # todo: json
    # the rule is different with Laravel
    max: (val, params) -> val <= params[0],
    # mimes:foo,bar,...: ip
    # the rule is different with Laravel
    min: (val, params) -> val >= params[0],
    notIn: (val, params) ->
      list = if isArray(params[0]) then params[0] else params
      return list.indexOf(val) == -1
    ,
    numeric: (val) -> isNumeric(val),
    # todo: regex
    required: {
      handler: (val, params, field) ->
        assignIfDifferently(field, 'required', true)
        return !empty(val)
      ,
      always: true
    },
    # todo: required_if:anotherfield,value,...
    # todo: required_unless:anotherfield,value,...
    requiredWith: {
      handler: (val, params, field, fields) ->
        if empty(fields[params[0]].value)
          assignIfDifferently(field, 'required', false)
          return true
        else
          assignIfDifferently(field, 'required', true)
          return !empty(val)
      ,
      sensitive: true,
      always: true
    },
    # todo: required_with_all:foo,bar,...
    # todo: required_without:foo,bar,...
    # todo: required_without_all:foo,bar,...
    same: {
      handler: (val, params, field, fields) ->
        relatedField = fields[params[0]]
        return val is relatedField.value
      ,
      sensitive: true
    },
    size: (val, params) -> (val || '').toString().length is parseInt(params[0]),
    string: (val) -> isString(val),
    # todo: timezone
    # todo: unique:table,column,except,idColumn
    # todo: url
    # custom rules
    length: (val, params) -> (val || '').toString().length is parseInt(params[0]),
    maxLength: (val, params) -> (val || '').toString().length <= params[0],
    minLength: (val, params) -> (val || '').toString().length >= params[0],
    lengthBetween: (val, params) ->
      len = (val || '').toString().length
      return params[0] <= len <= params[1]
  }
  messages: {
    accepted: 'The :name must be accepted.',
    alpha: 'The :name may only contain letters.',
    alphaDash: 'The :name may only contain letters, numbers, and dashes.',
    alphaNum: 'The :name may only contain letters and numbers.',
    array: 'The :name must be an array.',
    between: 'The :name must be between :params[0] and :params[1].',
    boolean: 'The :name field must be true or false.',
    confirmed: 'The :name confirmation does not match.',
    date: 'The :name is not a valid date.',
    different: 'The :name and :params[0] must be different.',
    email: 'The :name must be a valid email address.',
    in: 'The selected :name is invalid.',
    integer: 'The :name must be an integer.',
    max: 'The :name may not be greater than :params[0].',
    min: 'The :name must be at least :params[0].',
    notIn: 'The selected :name is invalid.',
    numeric: 'The :name must be a number.',
    required: 'The :name field is required.',
    requiredWith: 'The :name field is required when :params[0] is present.',
    same: 'The :name and :params[0] must match.',
    size: 'The :name must be :params[0] characters.',
    string: 'The :name must be a string.',
    # custom
    length: 'The :name must be :params[0] characters.',
    maxLength: 'The :name may not be greater than :params[0] characters.',
    minLength: 'The :name must be at least :params[0] characters.',
    lengthBetween: 'The :name must be between :params[0] and :params[1] characters.'
  }
}
