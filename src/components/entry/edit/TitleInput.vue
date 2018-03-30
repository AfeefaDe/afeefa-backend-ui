<template>
  <input-field
    class="inputField__spacing"
    field-name="title"
    v-model="item.title"
    validate="required|max:150"
    :label="$t('entries.title')"
    :options="{charCount: true}">
  </input-field>
</template>

<script>
import InputField from '@/components/InputField'

export default {
  props: ['item'],

  inject: ['$validator'],

  components: {
    InputField
  }
}
</script>
