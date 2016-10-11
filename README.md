# vue-data-validator
[中文文档](#ChineseDoc)

A validator for Vue.js 2.0. It bases on data instead of html. With common rules.\
Vue.js 2.0的数据验证插件，规则不写在模板里而是代码里。语法是仿laravel的。包含常用规则。我的第一个vue插件，请大方赞。
# Installation
```sh
$ npm install vue-data-validator

// install plugin
const VueDataValidator = require('vue-data-validator')
Vue.use(VueDataValidator.validator, VueDataValidator.options)
// or
const VueDataValidator = require('you-path/vue-data-validator/src/vue-data-validator.js')
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
        button.btn.btn-primary(type="submit", :disabled="!validation.valid") Sign in
</template>

<script>
module.exports = {
  data: function() {
    return {
      validation: '',
      fields: this.$generateFields({
        email: {
          rules: 'required|email|minLength:3'
        },
        password: {
          rules: 'required'
        }
      })
    };
  },
  methods: {
    submit: function() {
      this.validation.check().then(function () {
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
### Vue.generateFields, Vue.prototype.$generateFields [Function]
Help for generate fields:
```
fields: this.$generateFields({
        email: {
          rules: 'required|email|minLength:3'
        },
        password: {
          rules: 'required'
        }
      })
//
fields: {
    email: {
      name: 'email',
      text: 'Email',
      value: null,
      rules: 'required|email|minLength:3'
    },
    password: {
      name: 'password',
      text: 'Password',
      value: null,
      rules: 'required'
    },
}
```
# API for validation states
### valid [Boolean]
### dirty [Boolean]
### fields [Object]
### validating [Boolean]
unimportant
### name [String]
### setDirty [Function]
set state 'dirty' of all fields and validation object to specified.
### clear [Function]
clear validated states and set all dirty to false
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
### text [String]
show in error message
### nameInMessage [String]
show in error message instead of 'text' if exists
### rules [String]
format: 'ruleName:param1,param2|ruleName2|...'\
example: 'required|email|minLength:3'\
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
it needs to be assigned by a rule handler.
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
You can check './src/vue-data-validator-options.js/coffee'.
### handler [Function]
validate a value\
params: value, params, field, fields
return Boolean or Promise
### always [Boolean] [default: false]
when the state 'required' of a field is false, it will not be validate by a rule expect the 'always' is true.\
so it's suit for 'reuqired' or 'requiredWith' rule. remember change state 'required' in some rule. And important, you should put these rules which maybe change 'required' at the front.
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
message is a string, :name will be replaced to field nameInMessage/text/name, :param[0] will be replaced to first param, :param[n] will ...

<a name="ChineseDoc"></a>
#中文文档
Vue.js 2.0的数据验证插件，规则不写在模板里而是代码里。语法是仿laravel的。包含常用规则。我的第一个vue插件，请大方赞。
# 安装
```sh
$ npm install vue-data-validator

// 普通安装
const VueDataValidator = require('vue-data-validator')
Vue.use(VueDataValidator.validator, VueDataValidator.options)
// 自定义安装，如果你要导入其它的规则和消息模板的话
const VueDataValidator = require('you-path/vue-data-validator/src/vue-data-validator.js')
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
        button.btn.btn-primary(type="submit", :disabled="!validation.valid") Sign in
</template>

<script>
module.exports = {
  data: function() {
    return {
      validation: '',
      fields: this.$generateFields({
        email: {
          rules: 'required|email|minLength:3'
        },
        password: {
          rules: 'required'
        }
      })
    };
  },
  methods: {
    submit: function() {
      this.validation.check().then(function () {
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
### Vue.generateFields, Vue.prototype.$generateFields [Function]
生成字段集的帮助方法:
```
懒人写法
fields: this.$generateFields({
        email: {
          rules: 'required|email|minLength:3'
        },
        password: {
          rules: 'required'
        }
      })
//
完整写法
fields: {
    email: {
      name: 'email',
      text: 'Email',
      value: null,
      rules: 'required|email|minLength:3'
    },
    password: {
      name: 'password',
      text: 'Password',
      value: null,
      rules: 'required'
    },
}
```
# API 验证对象
### valid [Boolean]
### dirty [Boolean]
### fields [Object]
### validating [Boolean]
验证中，用于异步验证，不需使用
### name [String]
### setDirty [Function]
设置所有字段和验证对象的dirty为指定值
### clear [Function]
清除所有验证状态，watcher，设置dirty->false
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
### text [String]
在错误消息中显示
### nameInMessage [String]
如果设置了，就在错误消息中显示。优先级高于text
### rules [String]
格式: 'ruleName:param1,param2|ruleName2|...'\
example: 'required|email|minLength:3'\
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
此状态需要被一些特殊规则验证时修改，参考附带规则
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
可以浏览 './src/vue-data-validator-options.js/coffee'.很简单的
### handler [Function]
验证方法\
参数: value, params, field, fields\
返回布尔（立即完成）或promise（异步验证）
### always [Boolean] [default: false]
首先，字段是否必需不直接设置，而是由验证方法改变。比如’required‘规则将每次把‘必需’设置成true，requiredWith 规则某些情况下把’必需‘设置为true。然而，当一个字段是非必需时，会跳过规则。
always为true可以防止跳过。每次验证该字段时总是不跳过该规则。重要的是，改变’必需‘将影响后面的规则是否跳过，所以 required 规则或类似规则应总是写在前面。
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
 模板是字符串，包含占位符。:name 表示字段的名（nameInMessage > text）。：param[n] 代表第n个参数。
