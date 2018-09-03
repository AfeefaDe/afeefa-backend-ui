<template>
  <label :for="name" class="browser-default">
    <span v-if="validationErrors.has(name)" class="validation-error">
      {{ validationErrors.first(name) }}
    </span>
    <span v-else>{{ title }}</span>
    <span class="hint" v-if="maxChars">{{ chars }}/{{ maxChars }}</span>
  </label>
</template>

<script>
export default {
  props: ['name', 'title', 'maxChars', 'chars', 'validationErrors'],

  data () {
    return {
    }
  },

  watch: {
  },

  methods: {
  },

  computed: {
  }
}
</script>

