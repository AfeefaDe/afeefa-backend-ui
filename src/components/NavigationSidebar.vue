<template>
  <div class="navigationSidebar mainCard">
    <div class="mainCard__header">
      <navigation-breadcrumb></navigation-breadcrumb>
    </div>
    <div>
      <ul class="navigationSidebar__navContainer">
        <li :class="['navigationSidebar__navItem', 'level' + item.level]" v-for="item in items">
          <router-link :to="{name: item.route}" :exact="item.route==='dashboard'"> {{ $t(item.title) }} </router-link>
          <router-link :to="{name: item.action.route}" class="navigationSidebar__navItemAction" v-if="item.action">
            <i class="material-icons" :title="item.action.name">{{item.action.icon}}</i>
          </router-link>
          <span class="navigationSidebar__navItemMeta" v-if="item.hint || item.hint === 0">{{item.hint}}</span>
        </li>
      </ul>

      <ul>
        <button @click="changeLanguage" class="btn btn-lang">switch language</button>
      </ul>

      <div class="navigationSidebar__footer">
        <span class="navigationSidebar__footerItem" title="Der Name des aktuell eingeloggten Nutzers.">
          <i class="material-icons spacing-right">account_circle</i>{{username}}
        </span>
        <a href="" @click.prevent="logout()" class="cursor navigationSidebar__footerItem">
          {{ $t('headlines.logout') }}<i class="material-icons spacing-left">exit_to_app</i>
        </a>
      </div>

    </div>
  </div>
</template>


<script>
import NavigationMixin from './mixins/NavigationMixin'

export default {
  mixins: [NavigationMixin],
  methods: {
    changeLanguage () {
      if (this.$i18n.locale === 'de') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'de'
      }
    }
  }
}
</script>

<style>
button.btn-lang{
  font-size: 10px;
}
</style>
