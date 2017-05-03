<template>
  <div class="navigation-mobile">
    <div class="navigation-mobile__header">
      <navigation-breadcrumb></navigation-breadcrumb>

      <div id="btn-sandwich" @click="toggleMenu()">
        <i class="material-icons" v-if="visible">close</i>
        <i class="material-icons" v-else>menu</i>
      </div>
    </div>

    <div id="menu" v-if="visible">
      <div v-for="item in items">
        <router-link :to="{name: item.route}"> {{ $tc(item.title, 2) }}
          <span v-if="item.hint || item.hint === 0">({{item.hint}})</span>
        </router-link>
      </div>

      <section class="navigation-mobile__footer">
        <span><i class="material-icons">account_circle</i> {{username}}</span>
        <a href="" @click.prevent="logout()"> {{ $t('headlines.logout') }} </a>
      </section>
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
  padding: 1em 0.8em;
  background-color: $black_alpha;
  color: $white;
  /*defined in _variables.scss*/
  height: auto;
  z-index: 100;
  width: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #btn-sandwich {
    cursor: pointer;
    margin-top: 0.2em;
    i { font-size: 2em; }
  }

  #menu {
    margin-top: 0.5em;
    border-top: 1px solid $gray20;
    position: relative;
    text-align: left;
    a {
      display: block;
      cursor: pointer;
      margin: 10px 0;
      vertical-align: middle;
    }

    i {
      vertical-align: middle;
      margin-top: -3px;
    }
  }
}
</style>
