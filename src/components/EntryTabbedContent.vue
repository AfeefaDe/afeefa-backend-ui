<template>
<div class="tabbedSection">
    <ul class="tabbedSection__navItemContainer">
      <li :class="['tabbedSection__navItem', {active: activeTab === 'generalTab'}]">
        <a href="#" @click.prevent="setActiveTab('generalTab')">{{$t('headlines.generalTab')}}</a>
      </li>
      <li :class="['tabbedSection__navItem', {active: activeTab === 'placeTab'}]">
        <a href="#" @click.prevent="setActiveTab('placeTab')">{{$t('headlines.placeTab')}}</a>
      </li>
      <li :class="['tabbedSection__navItem', {active: activeTab === 'contactTab'}]">
        <a href="#" @click.prevent="setActiveTab('contactTab')">{{$t('headlines.contactTab')}}</a>
      </li>
      <li :class="['tabbedSection__navItem', {active: activeTab === 'linkTab'}]">
        <a href="#" @click.prevent="setActiveTab('linkTab')">{{$t('headlines.linkTab')}}</a>
      </li>
    </ul>

  <section v-show="activeTab === 'generalTab'">
    <slot name="generalTab"></slot>
  </section>

  <section v-show="activeTab === 'placeTab'">
    <slot name="placeTab"></slot>
  </section>

  <section v-show="activeTab === 'placeTab'">
    <slot name="contactTab"></slot>
  </section>

  <section v-show="activeTab === 'linkTab'">
    <slot name="linkTab"></slot>
  </section>
</div>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 'generalTab'
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
      this.activeTab = this.$route.query.tab || 'generalTab'
      this.$emit('setCurrentTab', this.activeTab)
    },
    setActiveTab (tab) {
      this.activeTab = tab
      // set active tab to parent (used to switch between edit/view mode consistently)
      this.$emit('setCurrentTab', this.activeTab)
      const query = {...this.$route.query}
      query.tab = tab === 'generalTab' ? undefined : tab
      this.$router.replace({query: query})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~variables";

.tabbedSection {
  &__navItemContainer {
    width: 100%;
    // fixes strange chrome bug (#200)
    overflow-x: hidden;
    background: transparent;
    color: inherit;
    box-shadow: none;
    border-bottom: 4px solid $turquoise;
    display: flex;
    justify-content: space-around;
  }
  &__navItem {
    flex-grow: 2;
    text-align: center;
    line-height: 150%;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    a {
      padding: 0.8em 0 0.6em 0;
      display: block;
      color: inherit;
    }
  }
  &__navItem:hover {
    background: $gray20;
  }
  &__navItem.active {
    background: $turquoise;
    color: white;
  }
}

</style>
