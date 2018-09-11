<template>
  <div>

    <div class="cols--2">
      <section>
        <input-field
          field-name="title"
          v-model="contact.title"
          validate="max:255"
          label="Kontaktbezeichnung">
        </input-field>

        <text-input v-if="owner.type === 'orgas'"
          class="formElement marginTop"
          v-model="contact.openingHours"
          fieldName="openingHours"
          :label="$t('entries.openingHours')" />

        <input-field
          class="formElement marginTop"
          field-name="web"
          v-model="contact.web"
          validate="url-with-protocol"
          validate-on-blur="true"
          label="Homepage">
        </input-field>

        <input-field
          class="socialMedia"
          field-name="socialMedia"
          v-model="contact.socialMedia"
          validate="url-with-protocol"
          validate-on-blur="true"
          label="Social Media">
        </input-field>

        <br>

        <lang-select-input
          style="border: 1px solid #CCCCCC;"
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
          <location-form :location="contact.location" />

          <input-field
            field-name="location_spec"
            v-model="contact.location_spec"
            validate="max:255"
            label="Ortsbezeichnung">
          </input-field>

          <button type="button" class="btn btn-small personButton" @click="removeLocation">Ort löschen</button>
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

        <button type="button" class="btn btn-small personButton" @click="detectContactType()">Kontakt hinzufügen</button>

        <div v-for="(person, index) in contact.contact_persons" :key="index" class="person">
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
          <a href="" class="inlineEditLink" @click.prevent="removeContactPerson(person)">Person löschen</a>
        </div>

        <button type="button" class="btn btn-small personButton" @click="addContactPerson()">Kontaktperson hinzufügen</button>
      </section>
    </div>


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
      directContact: '',
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

h2 {
  font-size: 1em;
  font-weight: bold;
}

h3 {
  font-size: 1em;
  font-weight: bold;
}

.person {
  margin-top: 3em;
  max-width: 400px;
  a {
    display: block;
    margin-top: 1em;
  }
}

.personButton {
  margin-top: 1.5em;
}

.socialMedia {
  margin-top: .8em;
}
</style>
