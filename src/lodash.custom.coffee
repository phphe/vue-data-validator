# lodash
module.exports =
  pull: (arr, v) ->
    index = arr.indexOf(v)
    if index > -1
      return arr.splice(index, 1)
    else
      return false
  values: (obj) ->
    values= []
    values.push v for k, v of obj
    return values
  findIndex: (arr, cb) ->
    key = -1
    for k,v of arr
      if cb(v,k)
        key = k
        break
    return key
  has: (obj, k) -> obj.hasOwnProperty(k)
  mapValues: (obj, cb) ->
    values = {}
    values[k] = cb(v, k) for k, v of obj
    return values
  forEach: (arr, cb) ->
    for k, v of arr
      cb(v, k)
    return
  forIn: (obj, cb) ->
    i = 0
    for k, v of obj
      r = cb(v, k, i)
      i++
      if r == false
        break
    return
