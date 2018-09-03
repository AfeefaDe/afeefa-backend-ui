<template>
  <input-field
    field-name="title"
    v-model="item.title"
    validate="required|max:150"
    :label="$t('entries.title')">
  </input-field>
</template>

<script>
export default {
  props: ['item'],

  inject: ['$validator']
}
</script>
