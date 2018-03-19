<template>
  <power-selector
    :items="orgas"
    :selected-items="selectedOwners"
    :search-fields="['title']"
    @select="addOwner"
    @remove="removeOwner"
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
import Orga from '@/models/Orga'
import PowerSelector from '@/components/PowerSelector'

export default {
  props: ['facetItem'],

  data () {
    return {
      orgas: [],
      selectedOwners: [],

      messages: {
        addButtonTitle: `${this.facetItem.title} hinzufügen`,
        removeTitle: `${this.facetItem.title} entfernen`,
        removeMessage: owner => {
          return `Soll der Akteur ${owner.title} dieses Item nicht mehr haben?`
        }
      }
    }
  },

  created () {
    Orga.Query.getAll().then(orgas => {
      this.orgas = orgas
    })

    this.facetItem.$rels.owners.Query.getAll().then(owners => {
      this.selectedOwners = owners
    })
  },

  methods: {
    addOwner (owner) {
      owner.$rels.facet_items.Query.attach(this.facetItem).then(result => {
        if (result) {
          this.selectedOwners.push(owner)
          this.$store.dispatch('messages/showAlert', {
            description: 'Der Owner wurde hinzugefügt'
          })
        }
      })
    },

    removeOwner (owner) {
      owner.$rels.facet_items.Query.detach(this.facetItem).then(result => {
        if (result) {
          this.selectedOwners = this.selectedOwners.filter(n => n.id !== owner.id)
          this.$store.dispatch('messages/showAlert', {
            description: 'Der Owner wurde entfernt'
          })
        }
      })
    }
  },

  components: {
    PowerSelector
  }
}
</script>
