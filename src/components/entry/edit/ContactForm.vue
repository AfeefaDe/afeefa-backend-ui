<template>
  <div>
    <h2>Ort</h2>

    <power-selector
      :items="locations"
      :selected-items="[contact.location]"
      :search-fields="['title', 'street', 'ownerTitle']"
      @select="locationChanged"
      @remove="locationRemoved"
      :messages="{
        addButtonTitle: 'Ort auswählen',
        removeTitle: 'Ort entfernen?',
        removeMessage: location => {
          return `Soll der Ort ${location.title} entfernt werden?`
        }
      }">
      <div slot="selected-item" slot-scope="props">
        <div>
          <div>{{ props.item.ownerTitle }}</div>
          <div v-if="props.item.title" class="addressDetail">{{ props.item.title }}</div>
          <div class="addressDetail">{{ props.item.street }}, {{ props.item.zip }}, {{ props.item.city }}</div>
        </div>
      </div>
      <div slot="item" slot-scope="props">
        <div>
          <div>{{ props.item.ownerTitle }}</div>
          <div v-if="props.item.title" class="addressDetail">{{ props.item.title }}</div>
          <div class="addressDetail">{{ props.item.street }}, {{ props.item.zip }}, {{ props.item.city }}</div>
        </div>
      </div>
    </power-selector>

    <location-form
      :location="contact.location"
      v-if="contact.location">
    </location-form>

    <h2>Kontaktperson</h2>

    <div v-for="person in contact.persons" :key="person.id">
      <h3>{{ person.role }}</h3>

      <input-field
        class="inputField__spacing"
        field-name="role"
        v-model="person.role"
        validate="max:255"
        label="Rolle">
      </input-field>

      <input-field
        field-name="name"
        v-model="person.name"
        validate="max:255"
        label="Name">
      </input-field>

      <input-field
        field-name="mail"
        v-model="person.mail"
        validate="max:255|email"
        validate-on-blur="true"
        label="E-Mail">
      </input-field>

      <input-field
        field-name="phone"
        v-model="person.phone"
        validate="max:255"
        label="Telefon">
      </input-field>
    </div>

    <button type="button" @click="addContactPerson(contact)">Kontaktperson hinzufügen</button>

    <h2>Rest</h2>

    <input-field
      field-name="fax"
      v-model="contact.fax"
      validate="max:255"
      label="Fax">
    </input-field>

    <div class="inputField__spacing input-field" v-if="item.type === 'orgas'">
      <label for="openingHours" :class="{active: contact.openingHours}">
        {{ $t('entries.openingHours') }}
      </label>
      <textarea
        v-model="contact.openingHours"
        id="openingHours"
        class="materialize-textarea"
        v-autosize>
      </textarea>
    </div>

    <input-field
      field-name="web"
      v-model="contact.web"
      validate="url-with-protocol"
      validate-on-blur="true"
      label="Homepage">
    </input-field>

    <input-field
      field-name="socialMedia"
      v-model="contact.socialMedia"
      validate="url-with-protocol"
      validate-on-blur="true"
      label="Social Media">
    </input-field>

    <lang-select-input
      @input="updateSpokenLanguages"
      :entryValue="contact.spokenLanguages">
    </lang-select-input>

    <button type="button" @click="saveContact">Kontakt Speichern</button>
  </div>
</template>

<script>
import Contacts from '@/resources/Contacts'
import Locations from '@/resources/Locations'
import Contact from '@/models/Contact'
import ContactPerson from '@/models/ContactPerson'

import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'
import LocationForm from './LocationForm'
import LangSelectInput from './LangSelectInput'
import sortByTitle from '@/helpers/sort-by-title'

export default {
  props: ['item'],

  inject: ['$validator'],

  data () {
    return {
      contact: new Contact(),
      locations: []
    }
  },

  created () {
    if (this.item.contacts.length) {
      this.contact = this.item.contacts[0]
    }

    Locations.getAll().then(locations => {
      this.locations = sortByTitle(locations, 'ownerTitle')
    })
  },

  methods: {
    locationChanged (location) {
      this.contact.location = location
    },

    locationRemoved () {
    },

    addContactPerson (contact) {
      const person = new ContactPerson()
      contact.persons.push(person)
    },

    updateSpokenLanguages (spokenLanguages) {
      this.item.spokenLanguages = spokenLanguages
    },

    saveContact () {
      Contacts.save(this.item.id, this.contact).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Kontakt erfolgreich gespeichert.'
          })
        }
      })
    }
  },

  components: {
    LangSelectInput,
    LocationForm,
    InputField,
    PowerSelector
  }
}
</script>

<style lang="scss" scoped>
.addressDetail {
  font-size: .8em;
}

h3 {
  font-size: 1em;
  font-weight: bold;
}
</style>
