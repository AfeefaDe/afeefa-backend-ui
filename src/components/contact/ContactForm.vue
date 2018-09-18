<template>
  <div class="contactForm">
    <div class="cols--2">
      <section>

        <entry-detail-section
          v-if="!location"
          :title="$tc('entries.address')"
          icon="location_on">

          <create-button-box
            entryType="locations"
            action="selectEntry"
            alternativeAction="createEntry"
            :selector="LocationSelector"
            @select="linkLocation"
            @alternativeAction="createLocation" />
        </entry-detail-section>

        <entry-detail-section
          v-if="location && locationIsLinked"
          :title="$tc('entries.address')"
          icon="location_on">

          <info-box>
            <div v-if="location.owner">
              Die Adresse wurde von
              <router-link :to="{name: location.owner.type + '.show', params: {id: location.owner.id}}">
                {{ location.owner.title }}
              </router-link>
              übernommen und kann dort geändert werden.
            </div>
            <a href="" @click.prevent="removeLocation" class="removeLink inlineEditLink">
              Verlinkte Adresse wieder entfernen.
            </a>
          </info-box>

          <div
            class="locationTitle"
            v-if="locationTitle && !editLocationSpec"
            @click="editLocationSpec = true">
            <div v-if="locationTitle">{{ locationTitle }}</div>
            <i class="material-icons">mode_edit</i>
          </div>

          <input-field
            class="locationSpecForm"
            v-if="editLocationSpec || !locationTitle"
            field-name="location_spec"
            v-model="contact.location_spec"
            validate="max:255"
            :preventEnter="true"
            :autoFocus="true"
            @esc="editLocationSpec = false"
            @blur="editLocationSpec = false"
            @enter="editLocationSpec = false">
          </input-field>

          <div v-if="location.street">{{ location.street }}</div>
          <div v-if="location.zip || location.city">
            {{ location.zip }} {{ location.city }}
          </div>

          <location-map
            :map-center="mapCenter(location)"
            :initial-zoom="16"
            :location="location"
            style="width: 80%; max-width:500px; max-height: 250px;">
          </location-map>
        </entry-detail-section>

        <entry-detail-section
          v-if="location && !locationIsLinked"
          class="addressForm"
          :title="$tc('entries.address')"
          icon="location_on"
          clickLink="Entfernen"
          @click="removeLocation">
          <location-form :location="location" />
        </entry-detail-section>

        <entry-detail-section
          class="contactAttributes"
          :title="$tc('headlines.contact')"
          icon="mail_outline">

          <text-input v-if="owner.type === 'orgas'"
            class="formElement halfMarginTop"
            v-model="contact.openingHours"
            fieldName="openingHours"
            :label="$t('entries.openingHours')" />

          <input-label name="langInput" title="Sprachen" class="formElement halfMarginTop" />
          <lang-select-input
            id="langInput"
            @input="updateSpokenLanguages"
            :entryValue="contact.spokenLanguages">
          </lang-select-input>

          <input-field
            class="formElement halfMarginTop"
            field-name="web"
            v-model="contact.web"
            validate="url-with-protocol"
            validate-on-blur="true"
            label="Homepage">
          </input-field>

          <input-field
            class="formElement halfMarginTop"
            field-name="socialMedia"
            v-model="contact.socialMedia"
            validate="url-with-protocol"
            validate-on-blur="true"
            label="Social Media">
          </input-field>
        </entry-detail-section>
      </section>

      <section>
        <div v-if="false">
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
        </div>

        <entry-detail-section
          class="contactPersons"
          title="Kontaktpersonen"
          icon="person">

          <create-button-box
            v-if="!contact.contact_persons.length"
            entryType="contact_persons"
            action="createEntry"
            @action="addContactPerson" />

          <entry-detail-property
            v-for="(person, index) in contact.contact_persons" :key="index"
            :title="person.role || 'Kontaktperson'"
            clickLink="Entfernen"
            @click="removeContactPerson(person)"
            class="contactPerson">

            <input-field
              field-name="role"
              v-model="person.role"
              validate="max:255"
              label="Rolle">
            </input-field>

            <input-field
              class="formElement halfMarginTop"
              field-name="name"
              v-model="person.name"
              validate="max:255"
              label="Name">
            </input-field>

            <input-field
              class="formElement halfMarginTop"
              :field-name="'mail-' + index"
              v-model="person.mail"
              :validate="`contact-person-phone-or-mail:#phone-${index}|${phoneRequired(person) ? 'required|' : ''}max:255|email`"
              validate-on-blur="true"
              label="E-Mail">
            </input-field>

            <input-field
              class="formElement halfMarginTop"
              :field-name="'phone-' + index"
              v-model="person.phone"
              :validate="`contact-person-phone-or-mail:#mail-${index}|${phoneRequired(person) ? 'required|' : ''}max:255`"
              label="Telefon">
            </input-field>

          </entry-detail-property>

          <div v-if="contact.contact_persons.length && contact.contact_persons.length < 3" class="formElement marginTop">
            <a href="" @click.prevent="addContactPerson" class="inlineEditLink">
              Weitere Konktaktperson hinzufügen
            </a>
          </div>

        </entry-detail-section>
      </section>
    </div>

  </div>
</template>

<script>
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

import ContactPerson from '@/models/ContactPerson'
import Location from '@/models/Location'

import LocationSelector from '@/components/actor/LocationSelector'
import InputLabel from '@/components/InputLabel'

import LocationMap from '@/components/Map'
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
      editLocationSpec: false,
      directContacts: {
        phone: [],
        mail: []
      },
      LocationSelector
    }
  },

  computed: {
    selectedLocations () {
      return this.location ? [this.location] : []
    },

    showLocationSelector () {
      return !this.location
    },

    locationIsLinked () {
      if (!this.location) {
        return false
      }
      return this.location.contact_id !== this.contact.id
    },

    location () {
      if (!this.contact.location) {
        return null
      }

      return this.contact.location
    },

    locationTitle () {
      if (!this.location) {
        return ''
      }

      return this.contact.location_spec ||
        this.location.title ||
        (this.location.owner ? this.location.owner.title : '')
    }
  },

  created () {
    Location.Query.getAll().then(locations => {
      this.locations = sortByTitle(locations, 'ownerTitle')
    })
  },

  methods: {
    phoneRequired (person) {
      return !person.phone && !person.mail
    },

    mapCenter (location) {
      if (location.lat) {
        return [location.lat, location.lon]
      } else {
        return [51.0571904, 13.7154319]
      }
    },

    linkLocation (location) {
      Location.Query.get(location.id).then(location => {
        this.contact.location = location
        this.contact.location_spec = ''
      })
    },

    createLocation () {
      const location = new Location()
      location.contact_id = this.contact.id
      this.contact.location = location
    },

    removeLocation () {
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
    }
  },

  components: {
    LangSelectInput,
    LocationForm,
    InputLabel,
    LocationMap
  }
}
</script>

<style lang="scss" scoped>
.contactForm {
  margin-top: 1em;
}

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

.noContact {
  margin-top: 1em;
  margin-bottom: 1em;
}

.createContactLink {
  margin-top: .5em;
}

.locationTitle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  i {
    font-size: 16px;
    position: relative;
    left: 5px;
    top: -2px;
  }
}

.addressForm,
.contactAttributes {
  width: 85%;
  max-width: 560px;
}

.locationSpecForm {
  max-width: 500px;
  width: 80%;
}

.customMultiselect {
  margin-top: .5em;
}

h2 {
  font-size: 1.2em;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $gray50;
  margin-top: 3em;
  margin-bottom: 0;
  &:first-child {
    margin-top: 0;
  }
}

h3 {
  margin: 0;
  font-size: 1em;
  font-weight: bold;
}

.contactPerson {
  &:not(:first-child) {
    margin-top: 3em;
  }
  max-width: 400px;
  .inputField:first-child {
    margin-top: 1.5em;
  }
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

.entryDetailSection:not(:first-child) {
  margin-top: 5em;
}
</style>
