<template>
<afeefa-page>

  <entry-header :entry="owner" :routeConfig="routeConfig" slot="header" :isEdit="true" />

  <div slot="content" v-if="contact">
    <form @submit.prevent="save" novalidate>
      <contact-form
        :owner="owner"
        :contact="contact"
        :routeConfig="routeConfig"
        @save="save" />

      <entry-edit-footer
        :item="owner"
        :routeConfig="routeConfig"
        @remove="remove"
        @save="save" />
    </form>
  </div>

  <div slot="content" v-else>
    <entry-loading-message :error="hasItemLoadingError" :messages="messages" />
  </div>

</afeefa-page>
</template>


<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'
import Contact from '@/models/Contact'
import ContactForm from './ContactForm'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

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

    save () {
      this.$validator.setLocale(this.$i18n.locale)
      this.$validator.validateAll().then(result => {
        let validationErrors = []
        if (!result) {
          validationErrors = this.$validator.errors.items
        }

        if (this.contact.isEmpty() && !this.contact.location) {
          validationErrors.push({
            msg: 'Keine Kontaktdaten angegeben.'
          })
        }

        // prepare errorString from all validationErrors
        let errorString = '\n\n'
        for (let validationError of validationErrors) {
          errorString += validationError.msg + '\n'
        }

        if (validationErrors.length) {
          this.$store.dispatch('messages/showAlert', {
            isError: true,
            autoHide: false,
            description: 'Es sind leider noch Fehler im Formular!' + errorString
          })
          return
        }
        this.owner.$rels.contacts.Query.save(this.contact).then(contact => {
          if (contact) {
            this.$store.dispatch('messages/showAlert', {
              description: 'Kontakt erfolgreich gespeichert.'
            })
            this.$router.push({name: this.routeName + '.show', params: {id: this.owner.id}})
          }
        })
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Kontakt entfernen',
        message: 'Soll der Kontakt gelöscht werden?'
      }).then(result => {
        if (result === 'yes') {
          this.owner.$rels.contacts.Query.delete(this.contact).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Der Kontakt wurde gelöscht.'
              })
              this.$router.push({name: this.routeName + '.show', params: {id: this.owner.id}})
            }
          })
        }
      })
    }
  },

  components: {
    ContactForm,
    EntryEditFooter
  }
}
</script>
