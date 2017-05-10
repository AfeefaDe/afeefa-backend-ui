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

  <slot name="generalTab" v-if="activeTab === 'generalTab'"></slot>

  <slot name="placeTab" v-if="activeTab === 'placeTab'"></slot>

  <slot name="contactTab" v-if="activeTab === 'contactTab'"></slot>

  <slot name="linkTab" v-if="activeTab === 'linkTab'"></slot>
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
    },
    setActiveTab (tab) {
      this.activeTab = tab
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
