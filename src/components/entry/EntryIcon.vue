<template>
  <div :class="['entryIcon', {inactive: item.hasOwnProperty('active') && !item.active}]">
    <i v-if="item.type === 'orgas'" class="material-icons orgas">group</i>
    <i v-if="item.type === 'offers'" class="material-icons offers">favorite</i>
    <i v-if="item.type === 'events'" class="material-icons events">date_range</i>
    <i v-if="item.type === 'annotations'" class="material-icons annotations">done</i>
    <i v-if="item.type === 'contacts'" class="material-icons contacts">mail_outline</i>
    <i v-if="item.type === 'locations'" class="material-icons locations">location_on</i>
    <i v-if="item.type === 'chapters'" class="material-icons locations">school</i>
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
  font-size: 2em;
  color: #993333;
}

.annotations {
  color: $gray50;
}

.offers {
  transform: scaleX(-1);
}
</style>
