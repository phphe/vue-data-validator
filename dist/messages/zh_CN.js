/*!
 * vue-data-validator v2.1.1
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/vue-data-validator.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.vueDataValidatorMessagesZhCN = global.vueDataValidatorMessagesZhCN || {}, global.vueDataValidatorMessagesZhCN.js = factory());
}(this, (function () { 'use strict';

var zh_CN = {
  accepted: '您必须同意:name才能继续。',
  alpha: ':name仅能包含字母。',
  alphaDash: ':name仅能包含字母，数字，破折号和下划线。',
  alphaNum: ':name仅能包含字母和数字。',
  between: ':name必须在:params[0]和:params[1]之间。',
  boolean: ':name必须为true或false。',
  date: ':name必须是一个正确格式的日期。',
  datetime: ':name必须是一个正确格式的日期时间。',
  different: ':name不能与:params[0]相同。',
  email: ':name不是一个正确的邮箱。',
  in: '选择的:name不可用。',
  integer: ':name必须是整数。',
  length: ':name必须包含:params[0]个字符。',
  lengthBetween: ':name的长度须在:params[0]和:params[1]之间。',
  max: ':name不能超过:params[0]。',
  maxLength: ':name的长度不能超过:params[0]。',
  min: ':name不能低于:params[0]。',
  minLength: ':name的长度不能低于:params[0]。',
  notIn: '选择的:name不可用。',
  numeric: ':name不是一个正确的数字。',
  regex: ':name格式错误。',
  required: '请填写:name。',
  requiredWith: '请填写:name。当:params[1]不为空时，:name必填。',
  same: ':name必须与:params[1]相同。',
  size: ':name必须有:params[0]个字符。',
  string: ':name必须是字符串。',
  // asynchronous rules
  remoteCheck: ':name错误。',
  remoteNotExisted: ':name已存在。'
};

return zh_CN;

})));
