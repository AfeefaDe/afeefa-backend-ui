<template>
  <div class="entryDetailSplitView">
    <div class="splitViewHeader" v-if="title">
      <div class="splitViewTitle">
        <div class="separator"></div>
        <h2>{{ title }}</h2>
      </div>
    </div>

    <div class="splitViewLeft">
      <slot name="left" />
    </div>

    <div class="splitViewRight">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],

  inject: ['$validator']
}
</script>

<style lang="scss" scoped>
.entryDetailSplitView {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .splitViewTitle {
    display: none;
    position: relative;

    .separator {
      position: absolute;
      border-bottom: 1px solid $gray10;
      height: 1px;
      top: .75em;
      left: -1.5em;
      right: -1.5em;
    }

    h2 {
      display: inline-block;
      margin: 0;
      padding: 0 .2em;
      margin-left: -.2em;
      font-size: .8em;
      color: $gray30;
      position: relative;
      background-color: white;
      text-transform: uppercase;
    }
  }

  .splitViewLeft {
    width: 50%;
    padding-left: 1em;
    padding-right: 4em;
  }

  .splitViewRight {
    width: 50%;
    margin-top: 1em;
    padding-right: 4em;
    padding-left: 4em;
  }

  @media screen and (max-width: $break-medium) {
    .splitViewLeft {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
    }
    .splitViewRight {
      width: 100%;
      margin-top: 0;
      padding-left: 0;
      padding-right: 0;
    }
  }
}

</style>
