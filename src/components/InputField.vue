<template>
  <div class="input-field">
    <label :for="fieldName" :class="{active: value || placeholder}">
      {{ label }}
      <span class="labelCharacterCount" v-if="has.charCount && value.length">{{value.length}}/150</span>
    </label>
    <input
      :type="inputType"
      :id="fieldName"
      :name="fieldName"
      :value="value"
      :placeholder="placeholder"

      :data-vv-validate-on="validateOn"
      v-validate.initial="validate"
      :data-vv-as="label"

      :class="{'validation-error': errors.has(fieldName) }"
      @input="updateValue($event.target.value)"/>
    <span v-show="errors.has(fieldName)" class="validation-error">{{ errors.first(fieldName) }}</span>
  </div>
</template>

<script>
export default {
  props: ['type', 'fieldName', 'value', 'placeholder', 'validate', 'validateOnBlur', 'label', 'options'],

  inject: ['$validator'],

  data () {
    const options = this.options || {}

    return {
      validateOn: this.validateOnBlur ? 'blur' : 'input',
      has: {
        charCount: options.charCount
      }
    }
  },

  methods: {
    updateValue (value) {
      this.$emit('input', value)
    }
  },

  computed: {
    inputType () {
      return this.type || 'text'
    }
  }
}
</script>

