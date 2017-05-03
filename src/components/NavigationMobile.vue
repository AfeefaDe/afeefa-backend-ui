<template>
  <div class="navigation-mobile">
    <navigation-breadcrumb></navigation-breadcrumb>

    <div id="btn-sandwich" @click="toggleMenu()">
  		<i class="material-icons">menu</i>
    </div>

    <div id="menu" v-if="visible">
      <div v-for="item in items">
        <router-link :to="{name: item.route}"> {{ $tc(item.title, 2) }}
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

<style lang="scss" scoped>
@import "~variables";

.navigation-mobile {
  display: block;
  padding: 1em;
  background-color: $black_alpha;
  color: $white;
  /*defined in _variables.scss*/
  height: $header-height;
  position: relative;
  z-index: 100;
  position: fixed;
  width: 100%;

  #btn-sandwich {
    position: absolute;
    top: 0.8em;
    right: 1em;
    cursor: pointer;

    i { font-size: 2em; }
  }

  #menu {
    position: absolute;
    padding: 1em 2em 1em 1.2em;
    top: 3.5em;
    right: 0;
    background-color: $black_alpha;

    section {
      font-size: 1.2em;
    }

    a {
      display: block;
      color: $white;
      cursor: pointer;
      margin: 10px 0;
      vertical-align: middle;
      font-size: 1.2em;
    }

    i {
      vertical-align: middle;
      font-size: 2em;
      margin-top: -3px;
    }
  }
}
</style>
