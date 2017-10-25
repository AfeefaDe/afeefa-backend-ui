<template>
<div class="resourceItem">
  <h2>{{resourceItem.title}}</h2>
  <p>{{resourceItem.description}}</p>
</div>
</template>

<script>

export default {
  props: ['resourceItem']
}
</script>

<style lang="scss" scoped>
@import "~variables";

.resourceItem {
  background: $gray20;
  border-radius: 5px;
  width: 100%;
  padding: 1.4em 1.5em 0.5em 1.5em;
  margin-bottom: 1em;
  h2 {
    font-size: 1.4em;
    font-weight: 500;
    margin: 0;
  }
}

</style>
