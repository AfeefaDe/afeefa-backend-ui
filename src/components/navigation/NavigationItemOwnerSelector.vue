<template>
  <power-selector
    :items="orgas"
    :selected-items="selectedOwners"
    :search-fields="['title']"
    @select="addOwner"
    @remove="removeOwner"
    :messages="messages">
    <div slot="selected-item" slot-scope="props">
      <div>
        <router-link :to="{name: props.item.type + '.show', params: {id: props.item.id}}">
          {{ props.item.title }}
        </router-link>
      </div>
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
  props: ['navigationItem'],

  data () {
    return {
      orgas: [],
      selectedOwners: [],

      messages: {
        addButtonTitle: `${this.navigationItem.title} hinzufügen`,
        removeTitle: `${this.navigationItem.title} entfernen`,
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
    this.fetchSelectedOwners()
  },

  watch: {
    navigationItem () {
      this.fetchSelectedOwners()
    }
  },

  methods: {
    fetchSelectedOwners () {
      this.navigationItem.$rels.owners.Query.getAll().then(owners => {
        this.selectedOwners = owners
      })
    },

    addOwner (owner) {
      this.navigationItem.$rels.owners.Query.attach(owner).then(result => {
        if (result) {
          this.selectedOwners.push(owner)
          this.$store.dispatch('messages/showAlert', {
            description: 'Der Owner wurde hinzugefügt'
          })
        }
      })
    },

    removeOwner (owner) {
      this.navigationItem.$rels.owners.Query.detach(owner).then(result => {
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
