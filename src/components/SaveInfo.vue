<template>
  <div>
    <div class="save-info-container" v-if="isSaving"></div>

    <div class="save-info" v-if="isSaving">
      <spinner :show="true" :width="8" :radius="25" :length="20" color="white" fade-color="black" />
    </div>
  </div>
</template>


<script>
import Spinner from '@/components/Spinner'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    isSaving: state => state.api.isSaving
  }),

  components: {
    Spinner
  }
}

</script>


<style lang="scss" scoped>
.save-info-container {
  position: fixed;
  z-index: $z-index-overlay + 10;
  background-color: black;
  opacity: .5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.save-info {
  position: fixed;
  z-index: $z-index-overlay + 11;
  left: 50%;
  top: ($header-height*2);
  transform: translateX(-50%);
  border-radius: 4px;
  swidth: 140px;
  sheight: 160px;
  padding: 30px 60px;
  color: black;
  sbackground-color: white;
  text-align: center;
}

.spinner-container {
  width: 80px;
  height: 80px;
}
</style>
