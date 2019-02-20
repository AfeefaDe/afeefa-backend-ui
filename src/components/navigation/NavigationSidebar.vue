<template>
  <div class="navigationSidebar mainCard" :class="userClass">
    <div class="logoContainer">
      <afeefa-logo></afeefa-logo>
    </div>

    <div class="">
      <ul class="navigationSidebar__navContainer">
        <li :class="['navigationSidebar__navItem', 'level' + item.level]" v-for="item in items" :key="item.id" v-if="showSideBarItem(item)">
          <router-link :to="{name: item.route, params: item.params}" :exact="item.route==='dashboard'">
            <i v-if="item.icon" class="material-icons offers">{{item.icon}}</i>
            <span class="navigationSidebar__navItemTitle">{{ translateTitle(item) }}</span>
          </router-link>
          <router-link :to="{name: item.action.route}" class="navigationSidebar__navItemAction" v-if="item.action">
            <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
          </router-link>
          <span class="navigationSidebar__navItemMeta" v-if="item.hint || item.hint === 0">{{item.hint}}</span>
        </li>
      </ul>

      <div class="navigationSidebar__footer">
        <div class="navigationSidebar__footerRow">
          <div class="navigationSidebar__footerItem" :title="$t('hints.user_status')">
            <i class="navigationSidebar__userIcon material-icons navigationSidebar__userIcon--spacingRight">account_circle</i>
            <div>
              <strong>{{currentUser.name}}</strong><br>
              <span class="navigationSidebar__area" v-if="currentUser.organization">
                {{ currentUser.organization }}
              </span>

            </div>
          </div>
        </div>
        <div class="navigationSidebar__footerSeperator"></div>
        <div class="navigationSidebar__footerRow">
          <div>
            <router-link :to="{name: 'usersettings'}">Meine Einstellungen</router-link><br>
            <span class="navigationSidebar__footerItem">
              {{ $t('headlines.systemLanguage') }}:
              <span v-for="lang in ['de', 'en']" :key="lang">
                <span v-if="lang === $i18n.locale"><strong class="spacingLeft">{{ $t('languages.'+lang) }}</strong></span>
                <span v-else><a href="" class="spacingLeft" @click.prevent="changeLanguage()">{{ $t('languages.'+lang) }}</a></span>
              </span>
            </span>
            <div class="navigationSidebar__footerItem" v-if="currentUser.hasMulitpleAreas">
              <div class="navigationSidebar__areaInfo">
                <span class="description">{{ $t('headlines.area') }}:</span>
                <div class="selector">
                  <span v-on:click="areaSelectorVisible = !areaSelectorVisible" class="title"><strong>{{sanitize(currentUser.area)}}</strong><i class="material-icons">arrow_drop_down</i></span>
                  <div class="navigationSidebar__areaSelector" v-if="areaSelectorVisible">
                    <span class="info">Die Region wechseln:</span>
                    <a href=""
                    v-for="area in currentUser.available_areas"
                    v-if="area != currentUser.area"
                    :key="area"
                    v-bind:class="{ active: area === currentUser.area }"
                    v-on:click="switchArea(area)">{{ sanitize(area) }}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="navigationSidebar__footerItem logout">
            <a href="" @click.prevent="logout()">
              {{ $t('headlines.logout') }}<i class="material-icons spacingLeft">exit_to_app</i>
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import NavigationMixin from '@/components/navigation/mixins/NavigationMixin'
import User from '@/models/User'

export default {
  mixins: [NavigationMixin],
  data () {
    return {
      areaSelectorVisible: false
    }
  },
  computed: {
    userClass () {
      return this.currentUser.first_name.toLowerCase()
    }
  },
  methods: {
    sanitize (string) {
      let result = string.charAt(0).toUpperCase() + string.slice(1)
      return result.replace('-', ' ')
    },
    switchArea (area) {
      if (area === this.currentUser.area) return
      let user = User.Query.getCurrentUser().clone()
      user.area = area
      User.Query.save(user).then(() => {
        // hack to force reload data
        window.location.reload(false)
        // a router redirect is the better solution; but the refresh of the items is not working properly
        // this.$router.push({name: 'dashboard'})
        console.log('Saved')
      })
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
    i {
      font-size: 1em;
      position: relative;
      top: 2px;
      margin-right: 0.2em;
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
  &__navItemTitle {
    display: inline-block;
    &:first-letter {
      text-transform: uppercase;
    }
  }
  &__navItemAction i {
    font-size: 1.2em;
    vertical-align: top;
  }
  &__areaInfo {
    display: flex;
    align-items: baseline;
    width: 100%;
    cursor: pointer;
    .selector {
      flex-grow: 2;
    }
    .description {
      margin-right: 0.5em;
    }
    .title {
      display: flex;
      align-items: center;
    }
  }
  &__areaSelector {
    flex: 0 0 100%;
    background: $white;
    margin-top: 0.5em;
    padding: 0.5em 1em;
    a {
      display: block;
      margin-left: 1em;
    }
    .active {
      font-weight: bold;
    }
    .info {
      font-size: 0.9em;
      color: $gray50;
    }
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
    // display: flex;
    // justify-content: space-between;
    margin-bottom: 0.5em;
  }
  & a.active {
    font-weight: bold;
  }
  &__footerItem {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-top: .5em;
    &.logout {
      justify-content: flex-end;
      a {
        display: flex;
        align-items: center;
      }
    }
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
