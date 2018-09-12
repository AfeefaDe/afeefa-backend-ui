<template>
  <div class="navigationSidebar mainCard" :class="userClass">
    <div class="logoContainer">
      <afeefa-logo></afeefa-logo>
    </div>

    <div class="">
      <ul class="navigationSidebar__navContainer">
        <li :class="['navigationSidebar__navItem', 'level' + item.level]" v-for="item in items" :key="item.id" v-if="showSideBarItem(item)">
          <router-link :to="{name: item.route, params: item.params}" :exact="item.route==='dashboard'"> {{ translateTitle(item) }}</router-link>
          <router-link :to="{name: item.action.route}" class="navigationSidebar__navItemAction" v-if="item.action">
            <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
          </router-link>
          <span class="navigationSidebar__navItemMeta" v-if="item.hint || item.hint === 0">{{item.hint}}</span>
        </li>
      </ul>

      <div class="navigationSidebar__footer">
        <div class="navigationSidebar__footerRow">
          <span class="navigationSidebar__footerItem" :title="$t('hints.user_status')">
            <i class="navigationSidebar__userIcon material-icons navigationSidebar__userIcon--spacingRight">account_circle</i>
            <div>
              <strong>{{currentUser.name}}</strong><br>
              <span v-if="currentUser.organization">{{ currentUser.organization }}</span>
            </div>
          </span>
        </div>
        <div class="navigationSidebar__footerSeperator"></div>
        <div class="navigationSidebar__footerRow">
          <div>
            <router-link :to="{name: 'usersettings'}">Meine Einstellungen</router-link><br>
            <span class="navigationSidebar__footerItem">
              {{ $t('headlines.systemLanguage') }}:
              <span v-for="lang in ['de', 'en']" :key="lang">
                <span v-if="lang === $i18n.locale"><strong class="spacingLeft">{{ $t('languages.'+lang) }}</strong></span>
                <span v-else><a href="#" class="spacingLeft" @click="changeLanguage()">{{ $t('languages.'+lang) }}</a></span>
              </span>
            </span>
          </div>
          <a href="" @click.prevent="logout()" class="cursor navigationSidebar__footerItem">
            {{ $t('headlines.logout') }}<i class="material-icons spacingLeft">exit_to_app</i>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import NavigationMixin from '@/components/navigation/mixins/NavigationMixin'

export default {
  mixins: [NavigationMixin],

  computed: {
    userClass () {
      return this.currentUser.first_name.toLowerCase()
    }
  },

  methods: {
    /* hacky way to hide chapter feature in bautzen */
    showSideBarItem (item) {
      if (item.route === 'navigation.show' && !this.currentUser.isAdmin()) return false
      if (item.route === 'chapters.list' && this.currentUser.area === 'bautzen') return false
      if (item.route === 'facets.list' && !this.currentUser.isAdmin()) return false
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.navigationSidebar {
  .logoContainer {
    height: $header_height;
    padding: 2em;
    padding-bottom: 0;
    .logo {
      height: 70%;
    }
  }

  &.felix, &.anna {
    background-color: inherit;
    box-shadow: none;
  }

  &__navContainer {
    margin: 0;
    margin-top: -1em;
  }

  &__navItem {
    padding: 0.8em 0 0.5em 0;
    border-bottom: 1px solid $gray20;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      border: none;
    }
  }
  &__navItem.level2 {
    margin-left: 1.5em;
  }
  &__navItem.level2 {
    margin-left: 1.5em;
  }
  &__navItem.level3 {
    margin-left: 3em;
  }
  &__navItem .active {
    font-weight: bold;
  }
  &__navItemMeta {
    float: right;
    background: $gray20;
    font-size: 0.8em;
    font-weight: bolder;
    padding: 0 0.5em;
    border-radius: 3px;
  }
  &__navItem:hover &__navItemAction {
    display: inline-block;
  }
  &__navItemAction {
    display: none;
    margin-left: 0.5em;
    margin-top: -0.2em;
  }
  &__navItemAction i {
    font-size: 1.2em;
    vertical-align: middle;
  }
  &__footer {
    margin-top: 4rem;
  }
  &__footerSeperator {
    border-top: 1px solid $gray20;
    padding-top: 0.8em;
    width: 100%;
    height: 0;
  }
  &__footerRow {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;
  }
  & a.active {
    font-weight: bold;
  }
  &__footerItem {
    display: flex;
    align-items: center;
  }
  &__areaName {
    text-transform: capitalize;
  }
  &__userIcon {
    color: $secondaryBlue;
    &--spacingRight {
      margin-right: 0.3em;
    }
  }
}
</style>
