<template>
  <power-selector
    :items="selectableActors"
    :selected-items="selectedActors"
    :search-fields="['title']"
    @select="addChild"
    @remove="removeChild"
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
      relationName: 'projects',
      apiRelationName: 'projects',

      messages: {
        addButtonTitle: 'Projekt hinzufügen',
        removeTitle: 'Projekt entfernen?',
        removeMessage: item => {
          return `Soll das Projekt ${item.title} aus der Projektliste entfernt werden?`
        }
      }
    }
  },

  components: {
    PowerSelector
  }
}
</script>
