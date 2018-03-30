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
      relationName: 'project_initiators',
      apiRelationName: 'projects',

      messages: {
        addButtonTitle: 'Träger hinzufügen',
        removeTitle: 'Trägerschaft entfernen?',
        removeMessage: actor => {
          return `Soll der Akteur ${actor.title} kein Träger mehr sein?`
        }
      }
    }
  },

  components: {
    PowerSelector
  }
}
</script>
