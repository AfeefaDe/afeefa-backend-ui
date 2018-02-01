<template>
  <div>
    <h2>Kontaktbezeichnung</h2>

    <input-field
      field-name="title"
      v-model="contact.title"
      validate="max:255"
      label="Bezeichnung">
    </input-field>

    <h2>Ort</h2>

    <power-selector
      :items="locations"
      :selected-items="selectedLocations"
      :search-fields="['title', 'street', 'ownerTitle']"
      @select="locationChanged"
      @remove="locationRemoved"
      :messages="{
        addButtonTitle: 'Ort ' + (selectedLocations.length ? 'ändern' : 'auswählen'),
        removeTitle: 'Ort entfernen?',
        removeMessage: location => {
          return `Soll der Ort ${location.title} entfernt werden?`
        }
      }"
      v-if="showLocationSelector">
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

    <div v-if="!contact.location">
      Oder <button type="button" class="btn btn-small" @click="createLocation">Neuen Ort anlegen</button>
    </div>

    <div v-if="contact.location && !locationIsLinked">
      <location-form :location="contact.location" />
      <button type="button" class="btn btn-small" @click="removeLocation">Ort löschen</button>
    </div>

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
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

import Locations from '@/resources/Locations'
import ContactPerson from '@/models/ContactPerson'
import Location from '@/models/Location'

import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'

import LocationForm from './LocationForm'
import LangSelectInput from './LangSelectInput'

import sortByTitle from '@/helpers/sort-by-title'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['item', 'contact'],

  inject: ['$validator'],

  data () {
    return {
      locations: []
    }
  },

  computed: {
    selectedLocations () {
      return this.contact.location ? [this.contact.location] : []
    },

    showLocationSelector () {
      return !this.contact.location || this.locationIsLinked
    },

    locationIsLinked () {
      return this.contact.location.owner.id !== this.item.id
    }
  },

  created () {
    Locations.getAll().then(locations => {
      this.locations = sortByTitle(locations, 'ownerTitle')
    })
  },

  methods: {
    locationChanged (location) {
      this.contact.location = location
    },

    createLocation () {
      const location = new Location()
      location.owner = this.item
      this.contact.location = location
    },

    removeLocation () {
      this.contact.location = null
    },

    locationRemoved () {
      this.contact.location = null
    },

    addContactPerson (contact) {
      const person = new ContactPerson()
      contact.persons.push(person)
    },

    updateSpokenLanguages (spokenLanguages) {
      this.contact.spokenLanguages = spokenLanguages
    },

    saveContact () {
      this.$emit('save')
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
