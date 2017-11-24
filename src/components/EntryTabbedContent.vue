<template>
<div class="tabbedSection">
  <ul class="tabbedSection__navItemContainer">
    <li v-for="tabName in tabNames" :class="['tabbedSection__navItem', {active: activeTab === tabName}]">
      <a href="#" @click.prevent="setActiveTab(tabName)">{{$t('tabs.'+tabName)}}</a>
    </li>
  </ul>

  <section v-for="tabName in tabNames" v-show="activeTab === tabName">
    <slot :name="tabName"></slot>
  </section>

</div>
</template>

<script>
export default {
  /*
   * the tabNames should be handled as a generic identifier for the tab
   * the translation i stored in 'tabs'.tabName
   */
  props: ['tabNames'],

  inject: ['$validator'],

  data () {
    return {
      activeTab: this.tabNames[0]
    }
  },
  created () {
    this.initPageProperties()
  },

  watch: {
    '$route' () {
      this.initPageProperties()
    }
  },

  methods: {
    initPageProperties () {
      if (this.tabNames.includes(this.$route.query.tab)) {
        this.activeTab = this.$route.query.tab
      } else {
        this.activeTab = this.tabNames[0]
      }
      this.$emit('setCurrentTab', this.activeTab)
    },
    setActiveTab (tab) {
      this.activeTab = tab
      // set active tab to parent (used to switch between edit/view mode consistently)
      this.$emit('setCurrentTab', this.activeTab)
      const query = {...this.$route.query}
      query.tab = tab === this.tabNames[0] ? undefined : tab
      this.$router.replace({query: query})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.tabbedSection {
  $activeBorderWidth: 3px;
  &__navItemContainer {
    width: 100%;
    // fixes strange chrome bug (#200)
    overflow-x: hidden;
    background: transparent;
    color: inherit;
    box-shadow: none;
    border-bottom: 1px solid $black;
    display: flex;
    justify-content: space-around;
  }
  &__navItem {
    flex-grow: 2;
    text-align: center;
    line-height: 150%;
    a {
      padding: 0.8em 0 0.6em 0;
      display: block;
      color: inherit;
    }
    &:hover {
      border-bottom: $activeBorderWidth solid $black;
      transition: all 0.2s ease;
    }
  }
  &__navItem.active {
    font-weight: bold;
    border-bottom: $activeBorderWidth solid $black;
  }
}

</style>
