<template>
  <div :class="['page', {sideBarVisible: sideBar}]">
    <div class="row">
      <div class="col s12 m12">
        <div class="mainCard2">
          <slot name="header" />

          <slot name="content" />
        </div>
      </div>
    </div>

    <div v-if="sideBar">
      <div class="mainCard2 sidebar">
        <slot name="sidebar" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['sideBar'],

  inject: ['$validator']
}
</script>


<style lang="scss" scoped>
.mainCard2 {
  margin-top: 2em;
  background-color: white;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);

  & > * {
    padding: 1.5em;
  }
}

.sideBarVisible {
  display: flex;
  margin-right: calc(300px + 1em);

  > *:first-child {
    flex-grow: 1;
  }
}

.sidebar {
  // overflow-x: hidden;
  // overflow-y: auto;
  position: fixed;
  width: 290px;
  max-height: calc(100% - 3.5em);
  margin-left: .5em;
}

</style>
