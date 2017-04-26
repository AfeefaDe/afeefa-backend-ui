<template>
  <div v-if="imageUrl" :class="[{'image-container-style': mediaImageLoaded}, {'loading-error': mediaImageError}]">
    <div v-if="mediaImageLoaded">
      <div class="image-container" :style="{ 'background-image': 'url(' + imageUrl + ')' }"> </div>
    </div>
    <div v-else-if="mediaImageError">
      Fehler beim laden des Bildes.
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
.image-container-style {
  background-color: #eee;
  padding: 0;
}
.image-container {
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  height: 30vh;
  max-height: 300px;
}
.loading-error {
  background-color: #ffeeee;
}
</style>
