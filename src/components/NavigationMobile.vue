<template>
  <div class="navigation-mobile">
    <div class="navigation-mobile__header">
      <navigation-breadcrumb :translate-title="translateTitle"></navigation-breadcrumb>

      <div id="btn-sandwich" @click="toggleMenu()">
        <i class="material-icons" v-if="visible">close</i>
        <i class="material-icons" v-else>menu</i>
      </div>
    </div>

    <div id="menu" v-if="visible">
      <div v-for="item in items" :class="['navigation-mobile__item', 'level' + item.level]" :key="item.title">
        <router-link :to="{name: item.route}">
          {{ translateTitle(item) }}
          <template v-if="item.hint || item.hint === 0">({{item.hint}})</template>
        </router-link>

        <router-link :to="{name: item.action.route}" class="navigation-mobile__itemAction" v-if="item.action">
          <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
        </router-link>
      </div>
    </div>

    <div id="footer" v-if="visible">
      <div class="navigation-mobile__footerSeperator"></div>
      <section class="navigation-mobile__footer">
        <span>
          <i class="material-icons spacing-right">account_circle</i> {{currentUser.name}} <span v-if="currentUser.organization">({{ currentUser.organization }})</span>
        </span>
      </section>
      <section class="navigation-mobile__footer">
        <div>
          <router-link :to="{name: 'usersettings'}">Meine Einstellungen</router-link><br>
          <div>
            {{ $t('headlines.systemLanguage') }}:
            <span v-for="(lang, index) in ['de', 'en']" :key="lang">
              <span v-if="lang === $i18n.locale"><strong class="spacing-left">{{ $t('languages.'+lang) }}</strong></span>
              <span v-else><a href="#" class="spacing-left" @click="changeLanguage()">{{ $t('languages.'+lang) }}</a></span>
            </span>
          </div>
        </div>
        <a href="" @click.prevent="logout()"> {{ $t('headlines.logout') }}<i class="material-icons spacing-left">exit_to_app</i></a>
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
  &__item {
    display: flex;
    justify-content: space-between;
  }
  &__item.level2 {
    margin-left: 1em;
  }
  &__item.level3 {
    margin-left: 2em;
  }
  &__itemAction i {
    font-size: 1.3em;
  }
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
  &__footerSeperator {
    border-top: 1px solid $gray20;
    padding-top: 0.8em;
    width: 100%;
    height: 0;
  }
  &__areaName {
    text-transform: capitalize;
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
      margin: 0.6em 0;
    }
    i {
      vertical-align: middle;
      margin-top: -3px;
    }
  }

  #footer {
    margin-top: 1em;
    a {
      display: inline-block;
      margin-top: 0.2em;
    }
    i {
      vertical-align: middle;
      margin-top: -3px;
    }
  }
}
</style>
