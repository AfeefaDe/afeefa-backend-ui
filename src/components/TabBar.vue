<template>
<div class="tabBar">
  <div v-if="tabs.length > 1">
    <ul class="tabBar__navItemContainer">
      <li v-for="tab in tabs" :key="tab.name" :class="['tabBar__navItem', {active: activeTab === tab}]">
        <a href="#" @click.prevent="setActiveTab(tab)">
          {{ $t('tabs.' + tab.name) }}
          <span v-if="tab.hint !== null">({{ tab.hint }})</span>
        </a>
      </li>
    </ul>
    <section v-for="tab in tabs" :key="tab.name" v-show="activeTab === tab" class="tabContent">
      <slot :name="tab.name"></slot>
    </section>
  </div>
  <div v-else>
    <section class="tabContent">
      <slot :name="tabs[0].name"></slot>
    </section>
  </div>
</div>
</template>

<script>
export default {
  /*
   * the tabs should be handled as a generic identifier for the tab
   * the translation i stored in 'tabs'.tabName
   */
  props: ['tabNames'],

  inject: ['$validator'],

  data () {
    return {
      tabs: [],
      activeTab: null
    }
  },

  created () {
    this.initTabs()
    this.initPageProperties()
  },

  watch: {
    '$route' () {
      this.initPageProperties()
    },

    tabNames () {
      this.initTabs()
    }
  },

  methods: {
    initTabs () {
      const newTabs = []
      for (let index in this.tabNames) {
        let tabName
        let tabHint = null
        if (typeof this.tabNames[index] === 'object') {
          tabName = this.tabNames[index].name
          tabHint = this.tabNames[index].hint
        } else {
          tabName = this.tabNames[index]
        }

        let tab = this.tabs.find(t => t.name === tabName)
        if (!tab) {
          tab = { name: tabName }
        }
        tab.hint = tabHint
        newTabs.push(tab)
      }
      this.tabs = newTabs
    },

    initPageProperties () {
      const activeTab = this.tabs.find(tab => {
        return tab.name === this.$route.query.tab
      })

      if (activeTab) {
        this.activeTab = activeTab
      } else {
        this.activeTab = this.tabs[0]
      }

      this.$emit('setCurrentTab', this.activeTab.name)
    },

    setActiveTab (tab) {
      this.activeTab = tab
      // set active tab to parent (used to switch between edit/view mode consistently)
      this.$emit('setCurrentTab', this.activeTab.name)

      const query = {...this.$route.query}
      query.tab = tab === this.tabs[0] ? undefined : tab.name
      this.$router.replace({query: query})
    }
  }
}
</script>

<style lang="scss" scoped>
.tabBar {
  margin-top: -1em;
  margin-left: -1em;
  margin-right: -1em;
  $activeBorderWidth: 3px;
  &__navItemContainer {
    margin: 0;
    /* fixes strange chrome bug (#200) */
    overflow-x: hidden;
    background-color: $white;
    color: inherit;
    box-shadow: none;
    display: flex;
  }

  .tabContent {
    padding: 1em;
  }

  &__navItem {
    padding: 0 2em;
    text-align: center;
    line-height: 150%;
    a {
      padding: 0.8em 0 0.6em 0;
      display: block;
      color: inherit;
    }
    &:hover {
      transition: all 0.2s ease;
    }
  }
  &__navItem.active {
    background-color: #FFFFFF;
    font-weight: bold;
  }
}

</style>
