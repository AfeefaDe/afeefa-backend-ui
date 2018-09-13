<template>
  <div>
    <input-label
      name="url" :title="$t('entries.image_link')"
      :validationErrors="validationErrors" />

    <input id="url" type="text" v-model="item[propertyName]"
      :class="['browser-default', {'validation-error': imageError}]"/>
  </div>
</template>

<script>
import InputLabel from '@/components/InputLabel'

export default {
  props: ['item', 'propertyName', 'imageError'],

  inject: ['$validator'],

  computed: {
    validationErrors () {
      return {
        has: () => this.imageError,
        first: () => this.$t('errors.loadingImageError')
      }
    }
  },

  components: {
    InputLabel
  }
}
</script>
