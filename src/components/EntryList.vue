<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">{{ $t('status.all') }} {{ messages.headline() }} ({{ numItems }})</h2>
          <router-link v-if="addEntryButton" :to="{name: addEntryButton}" class="mainCard__headerAction">
            <i class="material-icons">add</i>
          </router-link>
        </div>
        <entry-list-items
          :items="items"
          :sort-function="sortFunction"
          :options="options">
        </entry-list-items>
      </div>
    </div>
  </div>
</template>


<script>
import EntryListItems from '@/components/EntryListItems'

export default {
  props: ['items', 'sortFunction', 'options', 'messages', 'addEntryButton'],

  computed: {
    numItems () {
      return this.items ? this.items.length : 0
    }
  },

  components: {
    EntryListItems
  }
}
</script>
