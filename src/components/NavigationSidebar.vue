<template>
  <div class="navigationSidebar mainCard">
    <div class="mainCard__header">
      <navigation-breadcrumb></navigation-breadcrumb>
    </div>
    <div>
      <ul class="navigationSidebar__navContainer">
        <li :class="['navigationSidebar__navItem', 'level' + item.level]" v-for="item in items">
          <router-link :to="{name: item.route}" :exact="item.route==='dashboard'"> {{ $tc(item.title, 2) }} </router-link>
          <router-link :to="{name: item.action.route}" class="navigationSidebar__navItemAction" v-if="item.action">
            <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
          </router-link>
          <span class="navigationSidebar__navItemMeta" v-if="item.hint || item.hint === 0">{{item.hint}}</span>
        </li>
      </ul>

      <div class="navigationSidebar__footer">
        <div class="navigationSidebar__footerRow">
          <span class="navigationSidebar__footerItem">
            {{ $t('headlines.systemLanguage') }}:
            <a href="#" class="navigationSidebar__footerItemSpacing spacing-left" @click="changeLanguage()">{{ $t('languages.'+$i18n.locale) }}</a>
          </span>
        </div>
        <div class="navigationSidebar__footerSeperator"></div>
        <div class="navigationSidebar__footerRow">
          <span class="navigationSidebar__footerItem" :title="$t('hints.user_status')">
            <i class="navigationSidebar__userIcon material-icons spacing-right" @click="toggleMusic">
              <template v-if="playing">play_arrow</template>
              <template v-else>account_circle</template>
            </i>{{username}}
          </span>
          <a href="" @click.prevent="logout()" class="cursor navigationSidebar__footerItem">
            {{ $t('headlines.logout') }}<i class="material-icons spacing-left">exit_to_app</i>
          </a>
        </div>
      </div>
      <div class="sound-chillout-zone">
        <div id='video-player'></div>
      </div>

    </div>
  </div>
</template>


<script>
import NavigationMixin from './mixins/NavigationMixin'
import YouTubePlayer from 'youtube-player'


export default {
  mixins: [NavigationMixin],
  data () {
    return {
      playing: false,
      player: null,
      possibleVideos: ['YCoLUMURunQ']
    }
  },
  mounted () {
    this.player = YouTubePlayer('video-player')
  },
  methods: {
    changeLanguage () {
      if (this.$i18n.locale === 'de') {
        this.$i18n.locale = 'en'
        this.$validator.setLocale('en')
      } else {
        this.$i18n.locale = 'de'
        this.$validator.setLocale('de')
      }
    },
    toggleMusic () {
      if (!this.playing) {
        const id = this.possibleVideos[Math.floor(Math.random() * this.possibleVideos.length)]
        this.player.loadVideoById(id)
        this.player.playVideo()
        this.playing = true
      } else {
        this.player.stopVideo()
        this.playing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.navigationSidebar {
  &__navContainer {
    margin: 0;
  }
  &__navItem {
    padding: 0.8em 0 0.5em 0;
    border-bottom: 1px solid $gray20;
  }
  &__navItem.level2 {
    margin-left: 1.5em;
  }
  &__navItem.level2 {
    margin-left: 1.5em;
  }
  &__navItem.level3 {
    margin-left: 4em;
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
    margin-top: 8rem;
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
  &__footerItem {
    display: flex;
    align-items: center;
  }
  &__userIcon {
    color: $turquoise;
  }
}
.sound-chillout-zone {
  position: fixed;
  left: -99999px;
  top: -9999px;
  visibility: hidden;
}
</style>
