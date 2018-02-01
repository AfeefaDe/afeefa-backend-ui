<template>
<div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="item">
        <entry-edit-header :item="item" :routeConfig="routeConfig" />

        <contact-form
          :owner="item"
          :contact="contact"
          :routeConfig="routeConfig"
          @save="saveContact" />
      </div>

      <entry-loading-message v-else :error="hasItemLoadingError" :messages="messages" />
    </div>
  </div>
</template>


<script>
import EntryEditApiMixin from '@/components/entry/edit/mixins/EntryEditApiMixin'

import Contacts from '@/resources/Contacts'
import Contact from '@/models/Contact'

import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryEditHeader from '@/components/entry/edit/EntryEditHeader'

import ContactForm from './ContactForm'

export default {
  mixins: [EntryEditApiMixin],

  props: ['id', 'contactId'],

  data () {
    return {
      origContact: null,
      contact: null
    }
  },

  watch: {
    item (item) {
      if (this.contactId) {
        this.origContact = this.item.contacts.find(c => c.id === this.contactId)
      }
      if (!this.origContact) {
        this.origContact = new Contact()
      }
      this.contact = this.origContact.clone()
    }
  },

  methods: {
    $canLeaveRoute () {
      if (!this.contact) { // loading error
        return true
      }
      const hashOrig = JSON.stringify(this.origContact.serialize())
      const hashItem = JSON.stringify(this.contact.serialize())

      if (hashOrig === hashItem) {
        return true
      }
      return 'Soll das Editieren beendet werden?'
    },

    saveContact () {
      Contacts.save(this.item.id, this.contact).then(contact => {
        if (contact) {
          // update contact's owner contact list
          this.$emit('saved', contact)
          this.$store.dispatch('messages/showAlert', {
            description: 'Kontakt erfolgreich gespeichert.'
          })
          this.origContact = this.contact // prevent route leave dialog after save
          this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}})
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
