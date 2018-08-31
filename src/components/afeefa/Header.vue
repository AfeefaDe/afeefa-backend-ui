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

    <div class="headerSecondaryButtonContainer">
      <slot name="secondaryButtons" />
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
$height: 3em;

.header {
  position: relative;
  height: $header-height;
  background-color: $gray90;
  color: $white;

  padding: 1em 1em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.isEdit {
    background-color: $red_dark;
  }

  &.small {
    height: auto;
    justify-content: flex-start;
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

  a {
    color: $white;
  }
}

.navigation {
  .small & {
    display: none;
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
  .small & {
    margin: .2em 0;
    font-size: 1.2em;
  }
}

.headerSubtitle {
  font-size: 1rem;
  font-weight: normal;
  display: block;

  > * {
    margin-top: .6em;
  }

  /deep/ a {
    text-decoration: underline;
    color: $gray20;
  }

  .small & {
    display: none;
  }
}

.headerButtonContainer {
  position: absolute;
  right: 0;
  top: 0;
  margin: 2em;

  .small & {
    margin-top: 0;
    margin-right: 1em;
    top: 50%;
    transform: translateY(-50%);
  }

  @media screen and (max-width: $break-medium) {
    display: block;
  }
}

.headerButtonContainer /deep/ a {
  margin-right: .1em;
  border: none;

  @media screen and (max-width: $break-medium) {
    margin-right: 0;
    margin-bottom: 0.5em;
  }
}

.headerButtonContainer a {
  &:last-child {
    margin-right: 0;
  }
}

.headerSecondaryButtonContainer {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 1em 2em;

  a:not(:last-child) {
    margin-right: .1em;
  }
}
</style>
