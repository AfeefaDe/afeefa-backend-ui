<template>
  <div class="navigationBreadcrumb">
    <span v-for="(item, index) in items">
      <i class="material-icons" v-if="index">&nbsp;chevron_right</i>
      <router-link :to="{name: item.route}" v-if="item.route"> {{ $t(item.title) }} </router-link>
      <span v-else> {{ $t(item.title) }} </span>
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
