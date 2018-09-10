<template>
  <label :for="name" class="browser-default">
    <span v-if="validationErrors && validationErrors.has(name)" class="validation-error">
      {{ validationErrors.first(name) }}
    </span>
    <span v-else-if="title">{{ title }}</span>

    <span class="hint" v-if="maxChars">{{ chars }}/{{ maxChars }}</span>
    <span class="hint" v-else-if="hint">{{ hint }}</span>
  </label>
</template>

<script>
export default {
  props: ['name', 'title', 'hint', 'maxChars', 'chars', 'validationErrors'],

  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.hint {
  font-size: .9em;
}
</style>
