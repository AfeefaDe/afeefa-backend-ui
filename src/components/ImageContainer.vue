<template>
  <div v-if="imageUrl" class="image-container-style">
    <div v-if="mediaImageLoaded">
      <div class="image-container" :style="{ 'background-image': 'url(' + imageUrl + ')' }"> </div>
    </div>
    <div v-else-if="mediaImageError">
      Fehler beim laden des Bildes
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
        }
        img.onerror = () => {
          this.mediaImageError = true
          this.mediaImageLoaded = false
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
}
.image-container {
  background-repeat: no-repeat;
  background-position: center left;
  background-size: contain;
  height: 9rem;
}
</style>
