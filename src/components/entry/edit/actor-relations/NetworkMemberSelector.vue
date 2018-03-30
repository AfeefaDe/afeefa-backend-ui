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
      relationName: 'network_members',
      apiRelationName: 'network_members',

      messages: {
        addButtonTitle: 'Mitglied hinzufügen',
        removeTitle: 'Netzwerkmitglied austragen?',
        removeMessage: actor => {
          return `Soll der Akteur ${actor.title} aus dem Netzwerk ausgetragen werden?`
        }
      }
    }
  },

  components: {
    PowerSelector
  }
}
</script>
