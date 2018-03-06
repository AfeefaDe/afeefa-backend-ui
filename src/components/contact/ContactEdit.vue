<template>
<div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="owner">
        <entry-edit-header :item="owner" :routeConfig="routeConfig" />

        <contact-form
          v-if="contact"
          :owner="owner"
          :contact="contact"
          :routeConfig="routeConfig"
          @save="saveContact" />
      </div>

      <entry-loading-message v-else :error="hasItemLoadingError" :messages="messages" />
    </div>
  </div>
</template>


<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

import Contact from '@/models/Contact'

import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryEditHeader from '@/components/entry/edit/EntryEditHeader'

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
          this.contact = origContact.clone()
        } else {
          this.contact = new Contact().clone()
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
    EntryEditHeader,
    EntryLoadingMessage,

    ContactForm
  }
}
</script>
