<template>
  <div :class="['header', {isEdit: isEdit}]">
    <div class="navigation">
      <navigation-breadcrumb :translate-title="translateTitle"></navigation-breadcrumb>
    </div>

    <div class="headerContent">
      <div class="headerTitle">
        <div class="mainCard_type" v-if="false">
          <slot name="type" />
        </div>

        <h2 class="headerTitleHeading">
          <slot name="title" />
        </h2>

        <div class="headerSubtitle">
          <slot name="subTitle" />
        </div>
      </div>

    </div>

    <div class="headerButtonContainer">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script>
import NavigationMixin from '@/components/navigation/mixins/NavigationMixin'

export default {
  mixins: [NavigationMixin],

  props: ['isEdit'],

  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 24px;

.header {
  position: relative;
  height: $header-height;
  background-color: $gray90;
  color: $white;

  padding: .8em 1em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.isEdit {
    background-color: $red_dark;
  }
}

.headerContent {
  // padding-left: .5em;
  display: flex;
  align-items: center;
  a {
    // color: inherit;
    cursor: pointer;
  }
}

.headerTitle {
  display: inline-block;
  flex-grow: 2;
  overflow: hidden;
  padding-right: 1em;
  margin: 0;
  // line-height: $height;
}

.navigation {
  // background-color: $black;
  // margin-bottom: 3em;
  // margin: -3em -1em 1em -1em;
  // padding: .5em;
  /deep/ a {
    // color: $black !important;
  }
}

h2 {
  font-size: 1.2em;
  margin: 0;
}

.headerTitleHeading, .headerSubtitle  {
  white-space: normal;
  overflow: visible;
  text-overflow: none;
}

.headerTitleHeading {
  margin: 0;
  font-size: 1.7em;
}

.headerSubtitle {
  margin-top: .5em;
  font-size: 0.9rem;
  font-weight: normal;
  display: block;

  /deep/ a {
    text-decoration: underline;
    color: $gray20;
  }
}

.type {
  text-transform: uppercase;
  color: $gray20;
  padding-bottom: 0.5em;
  font-size: 0.9rem;
}

.headerButtonContainer {
  position: absolute;
  // top: $header_height;
  // right: 1em;
  right: 0;
  top: 0;
  margin: 2em;
  display: flex;
  @media screen and (max-width: $break-medium) {
    display: block;
  }
}

.headerButtonContainer a {
  font-size: 0.93em;
  // border: 1px solid white;
  // border-radius: 2px;
  padding: 0.3em 0.5em;
  margin-right: 1em;
  border: none;

  @media screen and (max-width: $break-medium) {
    margin-right: 0;
    margin-bottom: 0.5em;
  }

  &:last-child {
    margin-right: 0;
  }

  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    // background-color: $gray80;
  }

  i {
    font-size: 1.4em;
    // margin-left: 0.5em;
  }
}

.headerAction {
  color: inherit;
  max-height: $height;
}
</style>
