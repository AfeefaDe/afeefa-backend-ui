<template>
  <div :class="['entryIcon', {inactive: !item.active && item.type !== 'offers'}]">
    <i v-if="item.type === 'orgas'" class="material-icons">group</i>
    <i v-if="item.type === 'offers'" class="material-icons offers">message</i>
    <i v-if="item.type === 'events'" class="material-icons">date_range</i>
  </div>
</template>

<script>
export default {
  props: ['item']
}
</script>

<style lang="scss" scoped>
.inactive {
  opacity: .2;
}

i {
  color: $black;
}

.offers {
  transform: scaleX(-1);
}
</style>
