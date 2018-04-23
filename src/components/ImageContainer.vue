<template>
  <div v-if="imageUrl" :class="['imageContainer', {'imageContainer--loaded': mediaImageLoaded}, {'imageContainer--error': mediaImageError}]">
    <div v-if="mediaImageLoaded">
      <div class="imageContainer__content" :style="{ 'background-image': 'url(' + imageUrl + ')' }"> </div>
    </div>
    <div v-else-if="mediaImageError">
      {{$t('errors.loadingImageError')}}
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
  margin-top: -1em;
  margin-left: -1em;
  margin-right: -1em;

  &--loaded {
    background-color: $gray20;
  }
  &--error {
    background-color: #FFEEEE;
    color: $red;
  }
  &__content {
    background-repeat: no-repeat;
    background-position: top center;
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
