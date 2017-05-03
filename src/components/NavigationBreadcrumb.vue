<template>
  <div class="navigationBreadcrumb">
    <span v-for="(item, index) in items">
      <i class="material-icons" v-if="index">&nbsp;chevron_right</i>
      <router-link :to="{name: item.route}" v-if="item.route"> {{ $tc(item.title, 2) }} </router-link>
      <span v-else> {{ $tc(item.title, 2) }} </span>
    </span>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      items: state => state.navigation.pathNavigation
    })
  }
}
</script>
<style lang="scss" scoped>
@import "~variables";

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
