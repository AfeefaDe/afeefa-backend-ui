<template>
  <div class="inputField">
    <input-label
      v-if="label"
      :name="fieldName" :title="label"
      :maxChars="maxChars" :chars="chars"
      :validationErrors="errors" />

    <input
      :type="inputType"
      :id="fieldName"
      :name="fieldName"
      v-model="currentValue"
      :placeholder="placeholder"

      :data-vv-validate-on="validateOn"
      v-validate.initial="validate"
      :data-vv-as="label"

      v-focus="autoFocus !== undefined && autoFocus"

      @keydown.esc="$emit('esc')"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="checkPreventEnter"

      :class="['browser-default', {'validation-error': errors.has(fieldName)}]"
      @input="updateValue($event.target.value)"/>
  </div>
</template>

<script>
import InputLabel from '@/components/InputLabel'

export default {
  props: ['type', 'fieldName', 'value', 'placeholder', 'validate', 'validateOnBlur', 'label', 'preventEnter', 'autoFocus'],

  inject: ['$validator'],

  data () {
    return {
      currentValue: null,
      validateOn: this.validateOnBlur ? 'blur' : 'input',
      focus: false
    }
  },

  created () {
    this.currentValue = this.value
  },

  watch: {
    value (value) {
      this.currentValue = value
    }
  },

  computed: {
    maxChars () {
      if (this.focus) {
        if (this.validate) {
          const result = this.validate.match(/max:(\d+)/)
          if (result) {
            return result[1]
          }
        }
      }
      return 0
    },

    chars () {
      return (this.value && this.value.length) || 0
    },

    inputType () {
      return this.type || 'text'
    }
  },

  methods: {
    checkPreventEnter (event) {
      if (this.preventEnter) {
        event.preventDefault()
      }
      this.$emit('enter')
    },

    updateValue () {
      this.$emit('input', this.currentValue)
    },

    onFocus () {
      this.focus = true
      this.$emit('focus')
    },

    onBlur () {
      this.focus = false
      this.$emit('blur')
    }
  },

  components: {
    InputLabel
  }
}
</script>

