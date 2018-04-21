/*!
 * vue-data-validator v2.2.13
 * (c) 2017-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
var en = {
  accepted: 'The :name must be accepted.',
  alpha: 'The :name may only contain letters.',
  alphaDash: 'The :name may only contain letters, numbers, and dashes.',
  alphaNum: 'The :name may only contain letters and numbers.',
  between: 'The :name must be between :fieldName(:params[0]) and :fieldName(:params[1]).',
  boolean: 'The :name field must be true or false.',
  date: 'The :name is not a valid date.',
  datetime: 'The :name is not a valid datetime.',
  different: 'The :name and :fieldName(:params[0]) must be different.',
  email: 'The :name must be a valid email address.',
  in: 'The selected :name is invalid.',
  integer: 'The :name must be an integer.',
  length: 'The :name length must be :params[0].',
  lengthBetween: 'The :name length must be between :params[0] and :params[1].',
  max: 'The :name may not be greater than :params[0].',
  maxLength: 'The :name length may not be greater than :params[0].',
  min: 'The :name must be at least :params[0].',
  minLength: 'The :name length must be at least :params[0].',
  notIn: 'The selected :name is invalid.',
  numeric: 'The :name must be a number.',
  regex: 'The :name format is invalid.',
  required: 'The :name field is required.',
  requiredWith: 'The :name field is required when :fieldName(:params[0]) is present.',
  requiredIf: 'The :name field is required.',
  same: 'The :name and :fieldName(:params[0]) must match.',
  size: 'The :name length must be :params[0].',
  string: 'The :name must be a string.',
  // asynchronous rules
  remoteCheck: 'The :name is invalid.',
  remoteNotExisted: 'The :name already exists.'
};

export default en;
