<template>
  <div class="navigationBreadcrumb">
    <span v-for="(item, index) in items" :key="item.title">
      <i class="material-icons" v-if="index">&nbsp;chevron_right</i>
      <router-link :to="{name: item.route}" v-if="item.route"> {{ translateTitle(item) }} </router-link>
      <span v-else> {{ translateTitle(item) }} </span>
    </span>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  props: ['translateTitle'],

  computed: {
    ...mapState({
      items: state => state.navigation.pathNavigation
    })
  }
}
</script>

<style lang="scss" scoped>
.navigationBreadcrumb {
  display: inline-block;
  font-size: 1em;
  a {
    line-height: 1em;
    color: white;
  }
  i {
    font-size: 1em;
    vertical-align: middle;
  }
}
</style>
