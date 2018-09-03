<template>
  <div>
    <text-input
      v-model="item.short_description"
      fieldName="short_description"
      :label="$t('entries.short_description')"
      :placeholder="$t('entries.short_description')"
      validate="required|max:350" />

    <text-input v-if="has.description"
      class="formElement marginTop"
      v-model="item.description"
      fieldName="description"
      :label="$t('entries.description')"
      :placeholder="$t('entries.description')" />
  </div>
</template>

<script>
export default {
  props: ['item', 'options'],

  inject: ['$validator'],

  data () {
    const options = this.options || {}
    return {
      has: {
        description: options.description !== false
      }
    }
  }
}
</script>

