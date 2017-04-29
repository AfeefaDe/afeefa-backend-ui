<template>
<div class="tabbedSection">
    <ul class="tabbedSection__navItemContainer">
      <li :class="['tabbedSection__navItem', {active: activePane === 'generalPane'}]">
        <a href="#" @click.prevent="setActivePane('generalPane')">{{$t('headlines.generalPane')}}</a>
      </li>
      <li :class="['tabbedSection__navItem', {active: activePane === 'placePane'}]">
        <a href="#" @click.prevent="setActivePane('placePane')">{{$t('headlines.placePane')}}</a>
      </li>
      <li :class="['tabbedSection__navItem', {active: activePane === 'contactPane'}]">
        <a href="#" @click.prevent="setActivePane('contactPane')">{{$t('headlines.contactPane')}}</a>
      </li>
      <li :class="['tabbedSection__navItem', {active: activePane === 'linkPane'}]">
        <a href="#" @click.prevent="setActivePane('linkPane')">{{$t('headlines.linkPane')}}</a>
      </li>
    </ul>

  <slot name="generalPane" v-if="activePane === 'generalPane'"></slot>

  <slot name="placePane" v-if="activePane === 'placePane'"></slot>

  <slot name="contactPane" v-if="activePane === 'contactPane'"></slot>

  <slot name="linkPane" v-if="activePane === 'linkPane'"></slot>
</div>
</template>

<script>
export default {
  data () {
    return {
      activePane: 'generalPane'
    }
  },
  methods: {
    setActivePane (pane) {
      this.activePane = pane
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/_variables.scss";

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
