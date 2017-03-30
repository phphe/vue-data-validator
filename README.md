# This doc is deprecated
# vue-data-validator
[中文文档](#ChineseDoc)  
[中文：验证相关流程](#Chinese-validation-process)

A validator for Vue.js 2.0. It bases on data instead of html. With common rules.  
Vue.js 2.0的数据验证插件，规则不写在模板里而是代码里。语法是仿laravel的。包含常用规则。我的第一个vue插件，请大方赞。已经添加中文错误消息，请查看[中文文档](#ChineseDoc)。
# dependencies
some features depend on babel-polyfill
# Installation
```sh
$ npm install vue-data-validator

// install plugin
const VueDataValidator = require('vue-data-validator')
Vue.use(VueDataValidator.validator, VueDataValidator.options)
// or
const VueDataValidator = require('you-path/vue-data-validator/dist/validator.common.js')
Vue.use(VueDataValidator, yourOptions)

```
# Usage
```
// example
<template lang="pug">
    form.form(@submit.prevent="submit")
      .form-group.has-feedback(:class!="{'has-success': fields.email.dirty && fields.email.valid, 'has-error': fields.email.dirty && !fields.email.valid }")
        input.form-control(type="text", placeholder="Email", name="email", v-model="fields.email.value")
        .form-control-feedback: .fa.fa-envelope
        div(v-if!="fields.email.dirty && !fields.email.valid")
          .help-block(v-for="error in fields.email.errors") {{error.message}}

      .form-group.has-feedback(:class!="{'has-success': fields.password.dirty && fields.password.valid, 'has-error': fields.password.dirty && !fields.password.valid }")
        input.form-control(type="password", placeholder="Password", name="password", v-model="fields.password.value")
        .form-control-feedback: .fa.fa-lock
        div(v-if!="fields.password.dirty && !fields.password.valid")
          .help-block(v-for="error in fields.password.errors") {{error.message}}

      .form-group
        button.btn.btn-primary(type="submit", :disabled="!validation.valid || validation.validating") Sign in
</template>

<script>
module.exports = {
  data: function() {
    return {
      validation: '',
      fields: {
        email: {
          rules: 'required|email|minLength:3'
        },
        password: {
          rules: 'required'
        }
      }
    };
  },
  methods: {
    submit: function() {
      this.validation.check().then(function (values) {
        // submit
      }).catch(function () {
        // invalid
      })
    }
  },
  created: function() {
    this.$validate('validation', this.fields);
  }
};

</script>
```
# API
### Vue.Validator [Object]
It contains options. You can add rules or message to Vue.Validator.options.
### Vue.prototype.$validate [Function]
params: name(contain fields states and functions), fields
# API for validation states
### valid [Boolean]
### dirty [Boolean]
### fields [Object]
### validating [Boolean]
### name [String]
### setDirty [Function]
set state 'dirty' of all fields and validation object to specified.
### clear [Function]
set 'dirty, reuqired' of all fields to false. unwatch all watchers.
### check [Function]
check is all valid, return a promise.
```
this.validation.check().then(function (values) {
  // submit
}).catch(function () {
  // invalid
})
```
### getValues [Function]
return a object contains all values
# API for field
### name [String]
same to the key
### display [String]
show in error message
### nameInMessage [String]
show in error message instead of 'display' if exists
### rules [String]
format: 'ruleName:param1,param2|ruleName2|...'  
example: 'required|email|minLength:3'  
you can put parm in ruleParams
### ruleParams [Object]
eg:
```
ruleParams: {
    minLength: 3,
    between: [3,9]
}
```
### customRules [Object]
custom rules for this field
eg:
```
customRules: {
    minLength: Function or Object,
    between: Function or Object,
}
```
### messages [Object]
custom messages for this field,
eg:
```
messages: {
    minLength: 'custom message',
    between: 'custom message',
}
```
## field states
### valid [Boolean]
### dirty [Boolean]
### required [Boolean]
it is not necessary to assign.
### errors [Object]
errors: {
 required: {
    name: 'required',
    message: 'error message'
 }
}
# API for options
options: {
  rules: {
    required: Function or Object,
  }
  messages: {
    required: 'The :name must be accepted.'
  }
}
# API for rule
You can check './src/vue-data-validator-options.js'.
### handler [Function]
validate a value  
params: value, params, field, fields
return Boolean or Promise
### required [Boolean/Function] Optional
it determines if a field is required
it can be Boolean
also function
return Boolean or Promise
if it return a Promise, the result should pass to resolve
Important, you should put these rules which maybe has 'required' at the front.
eg:
```
email: {
      ...
      rules: 'required|email|minLength:3'
    },
```
### sensitive [Boolean] [default: false]
when a field's value changed, it will be validated. And other fields which with a sensitive rule will be also validated. It is suit for 'requiredWith, requiredIf' rule.
# API for message
 ```
 messages: {
    required: 'The :name must be accepted.'
 }
 ```
message is a string, :name will be replaced to field nameInMessage/display/name, :param[0] will be replaced to first param, :param[n] will be replaced to n param

<a name="ChineseDoc"></a>
#中文文档
Vue.js 2.0的数据验证插件，规则不写在模板里而是代码里。语法是仿laravel的。包含常用规则。我的第一个vue插件，请大方赞。
# 依赖
最好引入 babel-polyfill
# 安装
```sh
$ npm install vue-data-validator

// 普通安装
const VueDataValidator = require('vue-data-validator')
Vue.use(VueDataValidator.validator, VueDataValidator.options)
// 使用中文错误消息
const VueDataValidator = require('you-path/vue-data-validator/dist/validator.common.js')
const options = require('you-path/vue-data-validator/dist/options-cn.common.js')
Vue.use(VueDataValidator, options)
// 自定义安装，如果你要导入其它的规则和消息模板的话
const VueDataValidator = require('you-path/vue-data-validator/dist/validator.common.js')
Vue.use(VueDataValidator, yourOptions)

```
# Usage
```
// example
<template lang="pug">
    form.form(@submit.prevent="submit")
      .form-group.has-feedback(:class!="{'has-success': fields.email.dirty && fields.email.valid, 'has-error': fields.email.dirty && !fields.email.valid }")
        input.form-control(type="text", placeholder="Email", name="email", v-model="fields.email.value")
        .form-control-feedback: .fa.fa-envelope
        div(v-if!="fields.email.dirty && !fields.email.valid")
          .help-block(v-for="error in fields.email.errors") {{error.message}}

      .form-group.has-feedback(:class!="{'has-success': fields.password.dirty && fields.password.valid, 'has-error': fields.password.dirty && !fields.password.valid }")
        input.form-control(type="password", placeholder="Password", name="password", v-model="fields.password.value")
        .form-control-feedback: .fa.fa-lock
        div(v-if!="fields.password.dirty && !fields.password.valid")
          .help-block(v-for="error in fields.password.errors") {{error.message}}

      .form-group
        button.btn.btn-primary(type="submit", :disabled="!validation.valid || validation.validating") Sign in
</template>

<script>
module.exports = {
  data: function() {
    return {
      validation: '',
      fields: {
        email: {
          rules: 'required|email|minLength:3'
        },
        password: {
          rules: 'required'
        }
      }
    };
  },
  methods: {
    submit: function() {
      this.validation.check().then(function (values) {
        // submit
      }).catch(function () {
        // invalid
      })
    }
  },
  created: function() {
    this.$validate('validation', this.fields);
  }
};

</script>
```
# API
### Vue.Validator [Object]
包含全局设置。可以直接添加规则个错误消息模板到 Vue.Validator.options.
### Vue.prototype.$validate [Function]
参数: name(验证对象在vue实例上的名字，验证对象包含验证的几个字段的综合状态，和一些方法), fields(验证字段集：对象类型)
# API 验证对象
### valid [Boolean]
### dirty [Boolean]
### fields [Object]
### validating [Boolean]
验证中，用于异步验证
### name [String]
### setDirty [Function]
设置所有字段和验证对象的dirty为指定值
### clear [Function]
清除所有验证状态，watcher，设置dirty->false, required->false.
### check [Function]
检查所有是否通过，返回一个promise对象（如果当前正在验证中，也算不通过）
```
this.validation.check().then(function (values) {
  // submit
}).catch(function () {
  // invalid
})
```
### getValues [Function]
返回一个对象包含所有值
# API for field
### name [String]
必需与字段在fields中的key相同
### display [String]
在错误消息中显示
### nameInMessage [String]
如果设置了，就在错误消息中显示。优先级高于display
### rules [String]
格式: 'ruleName:param1,param2|ruleName2|...'  
example: 'required|email|minLength:3'  
一些特殊情况（参数包含特殊字符，参数不是字符串），也可以把参数放到 ruleParams 中
### ruleParams [Object]
eg:
```
ruleParams: {
    minLength: 3,
    between: [3,9]
}
```
### customRules [Object]
给当前字段自定义规则
eg:
```
customRules: {
    minLength: Function or Object,
    between: Function or Object,
}
```
### messages [Object]
给当前字段自定义错误消息模板
eg:
```
messages: {
    minLength: 'custom message',
    between: 'custom message',
}
```
## field states
### valid [Boolean]
### dirty [Boolean]
### required [Boolean]
此状态一般无需手动指定，特殊规则（required, requiredWith...）讲影响它的值
### errors [Object]
errors: {
 required: {
    name: 'required',
    message: 'error message'
 }
}
# API 设置
options: {
  rules: {
    required: Function or Object,
  }
  messages: {
    required: 'The :name must be accepted.'
  }
}
# API 规则
可以浏览 './src/vue-data-validator-options.js'.很简单的
### handler [Function]
验证方法  
参数: value, params, field, fields  
返回布尔（立即完成）或promise（异步验证）
### required [Boolean/Function] 可选
特殊规则才有必要拥有此项，它决定一个字段是否必需
可以为布尔值或方法
当它是方法时，返回一个布尔或promise
如果返回promise，则需把结果传给resolve，结果为布尔，则影响字段的“required”,为null，则不影响
重要的是，改变’必需属性‘将影响后面规则的验证，所以 required 规则或类似规则应总是写在前面。
eg:
```
email: {
      ...
      rules: 'required|email|minLength:3'
    },
```
### sensitive [Boolean] [default: false]
意为“敏感的”。当一个字段的值改变，此字段将被检查。其它的包含敏感规则的字段也将被检查。所以适合'requiredWith, requiredIf'这种导致字段与其它字段有关联的规则使用。
# API for 错误信息模板
 ```
 messages: {
    required: 'The :name must be accepted.'
 }
 ```
 模板是字符串，包含占位符。:name 表示字段的名（nameInMessage > display > name）。：param[n] 代表第n个参数。
 <a name="Chinese-validation-process"></a>

# 验证相关流程
### \$validate函数的执行过程
多个字段的验证结果将存储在一个组件的第一层子属性上，所以需要预定义验证对象，然后在使用$validate时需要验证对象的名字。this.$validate('验证对象名（一层）', 字段集对象)  
然后将根据名字寻找老的验证对象，如果存在，则清除
然后生成验证对象，补全字段属性，把字段规则解析为对象并存储，找出并存储敏感字段。附加验证对象到组件实例，并开始观察字段值的改变。  
当一个字段值改变时，此字段将会被验证。其它非敏感字段不会被验证。敏感字段：含有敏感规则。  
### 验证流程
为了异步验证机制，验证采用的线性验证。验证一个字段时，按顺序验证每个规则，一个规则验证完才会验证下一个。首先查看规则是否有required属性，然后按情况可能更改字段的required属性。然后如果字段非必需且为空，则不验证，跳到下一个规则。验证时字段和验证对象的的validating将是true，每次验证将会有id标明该验证，所以异步验证时，之前的验证结果将不会生效。
