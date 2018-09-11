<template>
  <div>
    <div class="cols--2">
      <section>
        <h3>Kontaktbezeichnung</h3>

        <input-field
          field-name="title"
          v-model="contact.title"
          validate="max:255">
        </input-field>

        <h3>Allgemein</h3>

        <div class="inputField__spacing input-field" v-if="owner.type === 'orgas'">
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

        <h3>Ort</h3>

        <power-selector
          v-if="showLocationSelector"
          :items="locations"
          :selected-items="selectedLocations"
          :search-fields="['title', 'city', 'street', 'ownerTitle']"
          @select="locationChanged"
          @remove="locationRemoved"
          :messages="{
            addButtonTitle: 'Ort ' + (selectedLocations.length ? 'ändern' : 'auswählen'),
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

        <div v-if="!contact.location">
          Oder <button type="button" class="btn btn-small" @click="createLocation">Neuen Ort anlegen</button>
        </div>

        <div v-if="contact.location && !locationIsLinked">
          <button type="button" class="btn btn-small" @click="removeLocation">Ort löschen</button>
          <location-form :location="contact.location" />
          <button type="button" class="btn btn-small" @click="removeLocation">Ort löschen</button>
        </div>
      </section>

      <section>
        <h3>Direktkontakte</h3>

        <div class="cols--2">
          <div>
            <label>Telefon</label>
            <p v-for="phone in directContacts.phone" :key="phone">{{phone}}</p>
          </div>
          <div>
            <label>E-Mail</label>
            <p v-for="mail in directContacts.mail" :key="mail">{{mail}}</p>
          </div>
        </div>
        <input-field
          class="inputField__spacing"
          field-name="phone-mail"
          validate="max:255"
          v-model="directContact"
          label="Telefon oder E-Mail">
        </input-field>
        <button type="button" @click="detectContactType()">Kontakt hinzufügen</button>

        <!-- TODO new persons do not have an id and result in 'Duplicate keys detected: ''. This may cause an update error.' -->
        <div v-for="person in contact.contact_persons" :key="person.id"> // wrong
          <h3>{{ person.role }}</h3>

          <a href="" @click.prevent="removeContactPerson(person)">Person löschen</a>

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

        <!-- <button type="button" @click="addContactPerson()">Kontaktperson hinzufügen</button> -->
      </section>
    </div>

    <button type="button" @click="saveContact">Kontakt Speichern</button>
  </div>
</template>

<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

import ContactPerson from '@/models/ContactPerson'
import Location from '@/models/Location'

import PowerSelector from '@/components/PowerSelector'

import LocationForm from './LocationForm'
import LangSelectInput from './LangSelectInput'

import sortByTitle from '@/helpers/sort-by-title'

import detector from '@/helpers/contact-type-detector'

export default {
  mixins: [RouteConfigAwareMixin],

  props: ['owner', 'contact'],

  inject: ['$validator'],

  data () {
    return {
      locations: [],
      directContacts: {
        phone: [],
        mail: []
      }
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
      if (!this.contact.location) {
        return false
      }
      return this.contact.location.contact_id !== this.contact.id
    }
  },

  created () {
    Location.Query.getAll().then(locations => {
      this.locations = sortByTitle(locations, 'ownerTitle')
    })
  },

  methods: {
    locationChanged (location) {
      this.contact.location = location
    },

    createLocation () {
      const location = new Location()
      location.contact_id = this.contact.id
      this.contact.location = location
    },

    removeLocation () {
      this.contact.location = null
    },

    locationRemoved () {
      this.contact.location = null
    },

    detectContactType () {
      if (this.directContact) {
        // console.debug('phone: ', detector.isPhone(this.directContact))
        // console.debug('mail: ', detector.isMail(this.directContact))

        if (detector.isPhone(this.directContact)) this.directContacts.phone.push(this.directContact)
        if (detector.isMail(this.directContact)) this.directContacts.mail.push(this.directContact)
      }
    },

    addContactPerson () {
      const person = new ContactPerson()
      this.contact.contact_persons.push(person)
    },

    removeContactPerson (person) {
      this.contact.contact_persons = this.contact.contact_persons.filter(p => p !== person)
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
    PowerSelector
  }
}
</script>

<style lang="scss" scoped>
.cols--2 {
  display: flex;
  justify-content: space-between;

  > * {
    width: 45%;
  }
}

.addressDetail {
  font-size: .8em;
}
</style>
