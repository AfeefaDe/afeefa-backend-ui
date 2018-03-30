<template>
  <div class="inputField__spacing input-field">
    <label for="url" :class="{active: item.media_url}">{{ $t('entries.image_link') }}</label>
    <input id="url" type="text" v-model="item.media_url"
      :class="{'validation-error': imageError}"/>
    <span v-if="imageError" class="validation-error">Die Bild-URL ist fehlerhaft.</span>
  </div>
</template>

<script>
export default {
  props: ['item', 'imageError'],

  inject: ['$validator']
}
</script>
