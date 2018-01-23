<template>
  <power-selector
    :items="selectableActors"
    :selected-items="selectedActors"
    :search-fields="['title']"
    @select="addParent"
    @remove="removeParent"
    :messages="messages">
    <div slot="selected-item" slot-scope="props">
      <div>{{ props.item.title }}</div>
    </div>
    <div slot="item" slot-scope="props">
      <div>{{ props.item.title }}</div>
    </div>
  </power-selector>
</template>

<script>
import PowerSelector from '@/components/PowerSelector'
import ActorRelationMixin from './mixins/ActorRelationMixin'

export default {
  mixins: [ActorRelationMixin],

  data () {
    return {
      relationName: 'networks',
      apiRelationName: 'network_members',

      messages: {
        addButtonTitle: 'Netzwerk hinzufügen',
        removeTitle: 'Aus dem Netzwerk austragen?',
        removeMessage: actor => {
          return `Soll der Akteur das Netzwerk ${actor.title} verlassen?`
        }
      }
    }
  },

  components: {
    PowerSelector
  }
}
</script>
