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

  <section v-show="activeTab === 'contactTab'">
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
