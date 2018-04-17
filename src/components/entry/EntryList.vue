<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">
            {{ messages.headline() }} ({{ currentNumItems }})
          </h2>

          <router-link v-if="addEntryButton" :to="{name: addEntryButton}" class="mainCard__headerButton">
            {{$t('buttons.add')}}
            <i class="material-icons">add</i>
          </router-link>
        </div>

        <slot></slot>

        <slot name="items">
          <entry-list-items
            :items="items"
            :sort-function="sortFunction"
            :options="options"
            :sort-order="sortOrder">
          </entry-list-items>
        </slot>

      </div>
    </div>
  </div>
</template>


<script>
import EntryListItems from '@/components/entry/EntryListItems'

export default {
  props: ['items', 'numItems', 'sortFunction', 'sortOrder', 'options', 'messages', 'addEntryButton'],

  computed: {
    currentNumItems () {
      return this.numItems || (this.items ? this.items.length : 0)
    }
  },

  components: {
    EntryListItems
  }
}
</script>
