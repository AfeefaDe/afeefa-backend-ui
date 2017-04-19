<template>
  <div class="navigation-mobile">
    <navigation-breadcrumb></navigation-breadcrumb>

    <div id="btn-sandwich" @click="toggleMenu()">
  		<i class="material-icons">menu</i>
    </div>

    <div id="menu" v-if="visible">
      <div v-for="item in items">
        <router-link :to="{name: item.route}"> {{ $t(item.title) }}
          <span v-if="item.hint || item.hint === 0">({{item.hint}})</span>
        </router-link>
      </div>

      <section id="user-context">
  	    <i class="material-icons">account_circle</i> {{username}}
  	  </section>
      <a href="" @click.prevent="logout()"> {{ $t('headlines.logout') }} </a>

    </div>
  </div>
</template>

<script>
import NavigationMixin from './mixins/NavigationMixin'

export default {
  mixins: [NavigationMixin],

  data () {
    return {
      visible: false
    }
  },

  methods: {
    toggleMenu () {
      this.visible = !this.visible
    }
  },

  created () {
    this.$router.afterEach((to, from) => {
      this.visible = false
    })

    window.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        this.visible = false
      }
    })
  }
}
</script>
