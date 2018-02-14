<template>
  <div class="navigationMobile">
    <div class="navigationMobile__header">
      <navigation-breadcrumb :translate-title="translateTitle"></navigation-breadcrumb>

      <div id="navigationMobile__sandwichButton" @click="toggleMenu()">
        <i class="material-icons" v-if="visible">close</i>
        <i class="material-icons" v-else>menu</i>
      </div>
    </div>

    <div class="navigationMobile__menu" v-if="visible">
      <div v-for="item in items" :class="['navigationMobile__item', 'level' + item.level]" :key="item.title">
        <router-link :to="{name: item.route}">
          {{ translateTitle(item) }}
          <template v-if="item.hint || item.hint === 0">({{item.hint}})</template>
        </router-link>

        <router-link :to="{name: item.action.route}" class="navigationMobile__itemAction" v-if="item.action">
          <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
        </router-link>
      </div>
    </div>

    <div class="navigationMobile__footerContainer" v-if="visible">
      <div class="navigationMobile__footerSeperator"></div>
      <section class="navigationMobile__footer">
        <span>
          <i class="material-icons spacingRight">account_circle</i> {{currentUser.name}} <span v-if="currentUser.organization">({{ currentUser.organization }})</span>
        </span>
      </section>
      <section class="navigationMobile__footer">
        <div>
          <router-link :to="{name: 'usersettings'}">Meine Einstellungen</router-link><br>
          <div>
            {{ $t('headlines.systemLanguage') }}:
            <span v-for="lang in ['de', 'en']" :key="lang">
              <span v-if="lang === $i18n.locale"><strong class="spacingLeft">{{ $t('languages.'+lang) }}</strong></span>
              <span v-else><a href="#" class="spacingLeft" @click="changeLanguage()">{{ $t('languages.'+lang) }}</a></span>
            </span>
          </div>
        </div>
        <a href="" @click.prevent="logout()"> {{ $t('headlines.logout') }}<i class="material-icons spacingLeft">exit_to_app</i></a>
      </section>
    </div>
  </div>
</template>

<script>
import NavigationMixin from '@/components/navigation/mixins/NavigationMixin'

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
.navigationMobile {
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
  &__areaName {
    text-transform: capitalize;
  }

  &__sandwichButton {
    cursor: pointer;
    margin-top: 0.2em;
    i {
      font-size: 2em;
    }
  }

  &__menu {
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

  &__footerContainer {
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
}
</style>
