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
