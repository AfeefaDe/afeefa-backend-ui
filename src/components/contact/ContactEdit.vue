<template>
<afeefa-page>

  <entry-header :entry="owner" :routeConfig="routeConfig" slot="header" />

  <div slot="content" v-if="contact">
    <contact-form
      :owner="owner"
      :contact="contact"
      :routeConfig="routeConfig"
      @save="saveContact" />
  </div>

  <div slot="content" v-else>
    <entry-loading-message :error="hasItemLoadingError" :messages="messages" />
  </div>

</afeefa-page>
</template>


<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

import Contact from '@/models/Contact'

import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'

import ContactForm from './ContactForm'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['id', 'contactId'],

  data () {
    return {
      owner: null,
      contact: null,
      hasItemLoadingError: false
    }
  },

  created () {
    this.Model.Query.get(this.id).then(owner => {
      if (owner) {
        this.owner = owner
        if (this.contactId) {
          const origContact = owner.contacts.find(c => c.id === this.contactId)
          this.contact = origContact.cloneWith('location', 'contact_persons')
        } else {
          this.contact = new Contact().cloneWith('location', 'contact_persons')
        }
      } else {
        this.hasItemLoadingError = true
      }
    })
  },

  methods: {
    $canLeaveRoute () {
      if (this.contact && this.contact.hasChanges()) {
        return 'Soll das Editieren beendet werden?'
      }
      return true
    },

    saveContact () {
      this.owner.$rels.contacts.Query.save(this.contact).then(contact => {
        if (contact) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Kontakt erfolgreich gespeichert.'
          })
          this.$router.push({name: this.routeName + '.show', params: {id: this.owner.id}})
        }
      })
    }
  },

  components: {
    EntryLoadingMessage,
    ContactForm
  }
}
</script>
