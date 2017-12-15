<template>
  <div class="inputField__spacing input-field">
    <label :for="fieldName" :class="{active: value}">
      {{ label }}
    </label>
    <input
      :type="inputType"
      :id="fieldName"
      :value="value"
      :name="fieldName"
      :data-vv-as="label"
      v-validate.initial="validation"
      :class="{'validation-error': errors.has(fieldName) }"
      @input="updateValue($event.target.value)"/>
    <span v-show="errors.has(fieldName)" class="validation-error">{{ errors.first(fieldName) }}</span>
  </div>
</template>

<script>
export default {
  props: ['type', 'value', 'fieldName', 'validation', 'label'],

  inject: ['$validator'],

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
