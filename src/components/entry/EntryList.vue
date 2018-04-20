<template>
  <afeefa-page>

    <afeefa-header slot="header">
      <div slot="title">
        {{ messages.headline() }} ({{ currentNumItems }})
      </div>

      <div slot="buttons">
        <router-link v-if="addEntryButton" :to="{name: addEntryButton}" class="btn green btn-medium">
          <i class="material-icons left">add</i>
          {{$t('buttons.add')}}
        </router-link>
      </div>
    </afeefa-header>

    <div slot="content">
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

  </afeefa-page>
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
