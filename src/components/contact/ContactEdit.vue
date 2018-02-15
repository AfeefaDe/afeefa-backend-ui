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
      origContact: null,
      contact: null,
      hasItemLoadingError: false
    }
  },

  created () {
    this.Resource.get(this.id).then(owner => {
      if (owner) {
        this.owner = owner
        if (this.contactId) {
          Contact.forOwner(owner).getAll().then(contacts => {
            this.origContact = contacts.find(c => c.id === this.contactId)
            this.contact = this.origContact.clone()
          })
        } else {
          this.origContact = new Contact()
          this.contact = new Contact()
        }
      } else {
        this.hasItemLoadingError = true
      }
    })
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
      Contact.forOwner(this.owner).save(this.contact).then(contact => {
        if (contact) {
          // update contact's owner contact list
          this.$store.dispatch('messages/showAlert', {
            description: 'Kontakt erfolgreich gespeichert.'
          })
          this.origContact = this.contact // prevent route leave dialog after save
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
