<template>
  <div>
    <label for="url" class="browser-default">{{ $t('entries.image_link') }}</label>
    <input id="url" type="text" v-model="item[propertyName]"
      :class="['browser-default', {'validation-error': imageError}]"/>
    <span v-if="imageError" class="validation-error">Die Bild-URL ist fehlerhaft.</span>
  </div>
</template>

<script>
export default {
  props: ['item', 'propertyName', 'imageError'],

  inject: ['$validator']
}
</script>
