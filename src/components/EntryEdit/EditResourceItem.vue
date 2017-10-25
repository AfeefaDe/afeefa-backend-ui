<template>
<div class="resourceItem">
   <input v-model="resourceItem.title" id="title" type="text" name="title"/>
   <input v-model="resourceItem.description" id="description" type="text" name="description"/>
   <input v-model="resourceItem.category" id="category" type="text" name="category"/>
   <a href="" @click.prevent="removeResourceItem">Löschen</a>
</div>
</template>

<script>

export default {
  props: ['resourceItem'],
  methods: {
    removeResourceItem: function () {
      this.$emit('remove', this.resourceItem)
    }
  }
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
