<template>
  <div class="navigationMobile">
    <div @click="toggleMenu()">
      <i class="material-icons menuButton">menu</i>
    </div>

    <div class="navigationMobile__content" v-if="visible">
      <i class="material-icons menuButton closeButton" @click="toggleMenu()">close</i>
      <div class="navigationMobile__menu">
        <div v-for="item in items" :class="['navigationMobile__item', 'level' + item.level]" :key="item.title" v-if="showSideBarItem(item)">
          <router-link :to="{name: item.route, params: item.params}">
            {{ translateTitle(item) }}
            <template v-if="item.hint || item.hint === 0">({{item.hint}})</template>
          </router-link>

          <router-link :to="{name: item.action.route}" class="navigationMobile__itemAction" v-if="item.action">
            <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
          </router-link>
        </div>
        <router-link class="navigationMobile__item level1" :to="{name: 'usersettings'}">Einstellungen</router-link>
      </div>

      <div class="navigationMobile__footerContainer">
        <div class="navigationMobile__footerSeperator"></div>
        <section class="navigationMobile__footer">
          <span>
            <i class="material-icons spacingRight">account_circle</i> {{currentUser.name}} <span v-if="currentUser.organization">({{ currentUser.organization }})</span>
          </span>
        </section>
        <section class="navigationMobile__footer">
          <div>
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
  margin-left: .6em;
  display: inline-block;
  color: $black;
  position: relative;
  top: 1em;

  .menuButton {
    font-size: 2.2em;
    cursor: pointer;

    &.closeButton {
      color: $black;
      position: absolute;
      right: .2em;
      top: .2em;
    }
  }

  &__content {
    min-width: 300px;
    background-color: white;
    position: absolute;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 2px 10px 0 rgba(0,0,0,0.2);
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    padding: 1em;
    z-index: 10;
    padding-top: 3em;
  }

  a {
    color: $black;
  }

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

  &__menu {
    position: relative;
    text-align: left;
    a {
      display: block;
      margin: 0.4em 0;
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
