<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">

          <h2 class="mainCard__headerTitle">
            {{ messages.headline() }} ({{ numItems }})
          </h2>

          <router-link v-if="addEntryButton" :to="{name: addEntryButton}"  class="mainCard__headerButton">
            {{$t('buttons.add')}}
            <i class="material-icons">add</i>
          </router-link>

        </div>

        <entry-list-items
          :items="items"
          :sort-function="sortFunction"
          :options="options"
          :sort-order="sortOrder">
        </entry-list-items>
      </div>
    </div>
  </div>
</template>


<script>
import EntryListItems from '@/components/EntryListItems'

export default {
  props: ['items', 'sortFunction', 'sortOrder', 'options', 'messages', 'addEntryButton'],

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

<style lang="scss" scoped>
.past-events-checkbox {
  display: flex;
  justify-content: flex-end;
}
</style>
