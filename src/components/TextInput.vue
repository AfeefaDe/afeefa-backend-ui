<template>
  <div>
    <input-label
      :name="fieldName" :title="label"
      :maxChars="maxChars" :chars="chars"
      :validationErrors="errors" />

    <textarea
      v-model="currentValue"
      :id="fieldName"
      :name="fieldName"
      :placeholder="placeholder"
      v-validate.initial="validate || ''"
      :data-vv-as="label"

      @focus="onFocus"
      @blur="onBlur"

      :class="['browser-default', {'validation-error': errors.has(fieldName)}]"
      @input="updateValue($event.target.value)"

      v-autosize>
    </textarea>
  </div>
</template>

<script>
import InputLabel from '@/components/InputLabel'

export default {
  props: ['fieldName', 'value', 'placeholder', 'validate', 'label'],

  inject: ['$validator'],

  data () {
    return {
      currentValue: null,
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
    }
  },

  methods: {
    updateValue (value) {
      this.$emit('input', value)
    },

    onFocus () {
      this.focus = true
    },

    onBlur () {
      this.focus = false
    }
  },

  components: {
    InputLabel
  }
}
</script>

