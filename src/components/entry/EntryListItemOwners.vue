<template>
  <div class="entryListItemOwners">
    <router-link :to="{name: 'orgas.show', params: {id: items[0].id}}">{{ items[0].title }}</router-link>
    <span v-if="items.length > 1">
      und {{ items.length - 1 }} weitere
    </span>
  </div>
</template>

<script>
export default {
  props: ['items']
}
</script>

<style lang="scss" scoped>
.entryListItemOwners {
  font-size: .9em;
  color: $gray30;

  a:hover {
    text-decoration: underline;
  }
}
</style>
