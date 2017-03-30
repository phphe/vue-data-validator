/*!
 * vue-data-validator v1.2.8
 * phphe
 * https://github.com/phphe/vue-data-validator.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.vueDataValidatorMessagesEn = global.vueDataValidatorMessagesEn || {}, global.vueDataValidatorMessagesEn.js = factory());
}(this, (function () { 'use strict';

var en = {
  accepted: 'The :name must be accepted.',
  alpha: 'The :name may only contain letters.',
  alphaDash: 'The :name may only contain letters, numbers, and dashes.',
  alphaNum: 'The :name may only contain letters and numbers.',
  between: 'The :name must be between :params[0] and :params[1].',
  boolean: 'The :name field must be true or false.',
  date: 'The :name is not a valid date.',
  datetime: 'The :name is not a valid datetime.',
  different: 'The :name and :params[0] must be different.',
  email: 'The :name must be a valid email address.',
  in: 'The selected :name is invalid.',
  integer: 'The :name must be an integer.',
  length: 'The :name must be :params[0] characters.',
  lengthBetween: 'The :name must be between :params[0] and :params[1] characters.',
  max: 'The :name may not be greater than :params[0].',
  maxLength: 'The :name may not be greater than :params[0] characters.',
  min: 'The :name must be at least :params[0].',
  minLength: 'The :name must be at least :params[0] characters.',
  notIn: 'The selected :name is invalid.',
  numeric: 'The :name must be a number.',
  required: 'The :name field is required.',
  requiredWith: 'The :name field is required when :params[1] is present.',
  same: 'The :name and :params[1] must match.',
  size: 'The :name must be :params[0] characters.',
  string: 'The :name must be a string.',
  // asynchronous rules
  remoteCheck: 'The :name is invalid.',
  remoteNotExisted: 'The :name already exists.'
};

return en;

})));
