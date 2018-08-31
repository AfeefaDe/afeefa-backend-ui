<template>
<div :class="['tabBar', {subBar: isSubBar}]">
  <div v-if="tabs.length > 1">
    <ul class="tabBar__navItemContainer">
      <li v-for="tab in tabs" :key="tab.name" :class="['tabBar__navItem', {active: activeTab === tab}]">
        <a href="#" @click.prevent="setActiveTab(tab)">
          <div class="colorIcon" :style="{'border-left-color': tab.color}" v-if="tab.color"></div>
          {{ $te('tabs.' + tab.name) ? $t('tabs.' + tab.name): tab.name }}
          <span v-if="tab.hint !== null" class="tabHint">({{ tab.hint }})</span>
        </a>
      </li>
    </ul>
    <section v-for="tab in tabs" :key="tab.name" v-if="activeTab === tab" class="tabContent">
      <slot name="default"></slot>
      <slot :name="tab.name"></slot>
    </section>
  </div>
  <div v-else>
    <section class="tabContent">
      <slot name="default"></slot>
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
  props: ['tabNames', 'isSubBar'],

  inject: ['$validator'],

  data () {
    return {
      tabs: [],
      urlKey: this.isSubBar ? 'subTab' : 'tab',
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
      const index = this.tabs.indexOf(this.activeTab)
      this.initTabs()
      if (index > -1) {
        const activeTab = this.tabs[index]
        if (activeTab) {
          this.setActiveTab(activeTab)
        }
      } else {
        this.setActiveTab(this.tabs[0])
      }
    }
  },

  methods: {
    initTabs () {
      const newTabs = []
      for (let index in this.tabNames) {
        let tabName
        let tabHint = null
        let tabColor = null
        if (typeof this.tabNames[index] === 'object') {
          tabName = this.tabNames[index].name
          tabHint = this.tabNames[index].hint
          tabColor = this.tabNames[index].color
        } else {
          tabName = this.tabNames[index]
        }

        let tab = this.tabs.find(t => t.name === tabName)
        if (!tab) {
          tab = { name: tabName }
        }
        tab.hint = tabHint
        tab.color = tabColor
        newTabs.push(tab)
      }
      this.tabs = newTabs
    },

    initPageProperties () {
      const activeTab = this.tabs.find(tab => {
        return tab.name === this.$route.query[this.urlKey]
      }) || this.tabs[0]

      if (activeTab !== this.activeTab) {
        this.activeTab = activeTab
        this.$emit('setCurrentTab', this.activeTab.name)
      }
    },

    setActiveTab (tab) {
      this.activeTab = tab

      const query = {...this.$route.query}

      // main tab switched, delete sub tab
      if (this.urlKey === 'tab') {
        delete query.subTab
      }

      // set tab if not the first one
      if (tab === this.tabs[0]) {
        delete query[this.urlKey]
      } else {
        query[this.urlKey] = tab.name
      }

      this.$router.replace({query: query})

      // set active tab to parent (used to switch between edit/view mode consistently)
      this.$emit('setCurrentTab', this.activeTab.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabBar {
  margin: -1.5em;
  &__navItemContainer {
    margin: 0;
    /* fixes strange chrome bug (#200) */
    overflow-x: hidden;
    background-color: $white;
    color: inherit;
    box-shadow: none;
    display: flex;
    flex-wrap: wrap;
  }

  .tabContent {
    padding: 1.5em;
  }

  &__navItem {
    .colorIcon {
      width: 5px;
      height: .8em;
      border-left: 5px solid transparent;
      margin-right: .4em;
    }
    a {
      padding: 0.8em 1.5em;
      display: flex;
      align-items: center;
      color: inherit;
    }
    &:hover {
      transition: all 0.2s ease;
      background-color:#F8F8F8;
    }
    .tabHint {
      font-size: .8em;
      margin-left: .3em;
    }
  }

  &__navItem.active {
    background-color: #FFFFFF;
    font-weight: bold;
  }

  &.subBar {
    .tabBar__navItemContainer {
      justify-content: center;
    }
    .tabBar__navItem {
      margin-top: .3em;
    }
    .tabBar__navItem a {
      font-size: .9em;
      padding: .6em 1.5em;
    }
  }
}

</style>
