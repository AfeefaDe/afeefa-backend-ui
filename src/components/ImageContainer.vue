<template>
  <div v-if="imageUrl" :class="['imageContainer', {'imageContainer--loaded': mediaImageLoaded}, {'imageContainer--error': mediaImageError}]">
    <div v-if="mediaImageLoaded">
      <div class="imageContainer__content" :style="{ 'background-image': 'url(' + imageUrl + ')' }"> </div>
    </div>
    <div v-else-if="mediaImageError">
      {{$t('errors.loadingImageError')}}<br>
      <a :href="imageUrl" target="_blank">{{ imageUrl }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['imageUrl'],

  data () {
    return {
      mediaImageLoaded: false,
      mediaImageError: false
    }
  },

  created () {
    this.validateImageUrl()
  },

  methods: {
    validateImageUrl () {
      if (this.imageUrl) {
        const img = new Image()
        img.src = this.imageUrl
        img.onload = () => {
          this.mediaImageLoaded = true
          this.mediaImageError = false
          this.$emit('state', {mediaImageError: this.mediaImageError})
        }
        img.onerror = () => {
          this.mediaImageError = true
          this.mediaImageLoaded = false
          this.$emit('state', {mediaImageError: this.mediaImageError})
        }
      } else {
        this.mediaImageError = false
        this.mediaImageLoaded = false
        this.$emit('state', {mediaImageError: this.mediaImageError})
      }
    }
  },

  watch: {
    imageUrl () {
      this.validateImageUrl()
    }
  }
}
</script>

<style lang="scss" scoped>
.imageContainer {
  margin: -1.5em;
  margin-bottom: 1.5em;

  &--loaded {
    background-color: $gray20;
  }
  &--error {
    color: $red;
    padding: 1.5em 0;
    text-align: center;
  }
  &__content {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    height: 50vh;
    /* matches max-height of bunner at afeefa.de */
    max-height: 150px;
    /* matches sidebar width of afeefa.de */
    max-width: 440px;
    margin: 0 auto;
  }
}
</style>
