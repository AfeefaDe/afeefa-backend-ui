<template>
<div class="resourceItem">
  <div class="resourceItem__header">
    <span class="resourceItem__heading">
        <input v-if="editEnabled" v-model="resourceItem.title" id="title" type="text" name="title" placeholder="Titel"/>
        <template v-else>{{resourceItem.title}}</template>
    </span>
    <a href="" @click.prevent="removeResourceItem" v-if="editEnabled"><i class="material-icons">delete</i></a>
  </div>

  <input v-if="editEnabled" v-model="resourceItem.category" id="category" type="text" name="category" placeholder="Kategorie"/>
  <div v-else class="resourceItem__meta">
    {{resourceItem.category}} ·
    {{ $t('status.changed') }} {{resourceItem.updated_at | formatDateAbsolute}}<span> ({{resourceItem.updated_at | formatDateRelative}})</span>
  </div>

  <p>
    <input v-if="editEnabled" v-model="resourceItem.description" id="description" type="text" name="description" placeholder="Beschreibung"/>
    <template v-else>{{resourceItem.description}}</template>
  </p>

</div>
</template>

<script>

export default {
  props: ['resourceItem', 'editEnabled'],
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
  border: $gray20 2px solid;
  border-radius: 5px;
  width: 100%;
  padding: 1.4em 1.5em 1em 1.5em;
  margin-bottom: 1em;
  &__heading {
    font-size: 1.4em;
    font-weight: 500;
    margin: 0;
  }
  &__meta {
    color: $gray50;
    margin-top: 0.5em;
  }
  &__header {
    display: flex;
    i {
      color: $black;
      margin-left: 0.4em;
    }
    span {
      flex-grow: 2;
    }
  }
  input {
    margin: 0!important;
  }
}

</style>
