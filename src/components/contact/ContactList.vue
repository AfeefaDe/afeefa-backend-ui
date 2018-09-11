<template>
  <div class="contactList">

    <div v-if="!contact">
      <entry-detail-section
        class="contactSection"
        :title="$t('headlines.contact')"
        icon="mail_outline">
        <div>
          <div class="noContact">Noch kein Kontakt erstellt.</div>
          <contact-selector @select="linkContact">
            <button class="btn btn-small">
              Kontakt finden
            </button>
          </contact-selector>
        </div>

        <div class="createContactLink">
          <router-link :to="{name: item.type + '.contactnew'}" class="inlineEditLink">
            neuen Kontakt erstellen
          </router-link>
        </div>
      </entry-detail-section>
    </div>

    <entry-detail-section
      v-if="location"
      :title="$tc('entries.address')"
      icon="location_on"
      :clickLink="!isOwnContact ? 'Entfernen' : ''"
      :editLink="isOwnContact ? contactEditRoute : ''"
      @click="unlinkContact">

      <div v-if="location.title">{{ location.title }}</div>
      <div v-if="location.street">{{ location.street }}</div>
      <div v-if="contact.location.zip || location.city">
        {{ location.zip }} {{ location.city }}
      </div>
      <location-map
        :map-center="mapCenter(location)"
        :initial-zoom="16"
        :location="location"
        style="max-width:400px; max-height: 200px;">
      </location-map>
    </entry-detail-section>

    <entry-detail-section
      v-if="contact"
      class="contactSection"
      :title="$t('headlines.contact')"
      icon="mail_outline"
      :editLink="isOwnContact ? contactEditRoute : ''">

      <entry-detail-property2
        v-for="person in contact.contact_persons" :key="person.id"
        :title="person.role || 'Kontaktperson'">
        <div v-if="person.name">{{ person.name }}</div>
        <div v-if="person.phone">{{ person.phone }}</div>
        <div v-if="person.mail"><a :href="'mailto: ' + person.mail">{{ person.mail }}</a></div>
      </entry-detail-property2>

      <entry-detail-property2 v-if="contact.openingHours"
        :title="$t('entries.openingHours')">
        {{ contact.openingHours }}
      </entry-detail-property2>

      <entry-detail-property2 v-if="contact.spokenLanguages"
        :title="$tc('headlines.spokenLanguages', contact.spokenLanguages.split(',').length)">
        {{ stringifySpokenLanguages(contact.spokenLanguages) }}
      </entry-detail-property2>
    </entry-detail-section>

    <entry-detail-section
      v-if="contact && (contact.web || contact.socialMedia)"
      title="Links"
      icon="link"
      :editLink="isOwnContact ? contactEditRoute : ''">
      <div v-if="contact.web">
        <a :href="contact.web" target="_blank">{{ displayedUrl(contact.web) }}</a><br>
      </div>
      <div v-if="contact.socialMedia">
        <a :href="contact.socialMedia" target="_blank">{{ displayedUrl(contact.socialMedia) }}</a>
      </div>
    </entry-detail-section>
  </div>
</template>

<script>
import Languages from '@/helpers/iso_639_languages.js'

import LocationMap from '@/components/Map'
import ContactSelector from '@/components/actor/ContactSelector'

export default {
  props: ['item'],

  computed: {
    contact () {
      return this.item.contacts.length ? this.item.contacts[0] : null
    },

    location () {
      return this.contact ? this.contact.location : null
    },

    contactEditRoute () {
      return {name: this.item.type + '.contactedit', params: {contactId: this.contact.id}}
    },

    isOwnContact () {
      return this.contact.owner === this.item
    }
  },

  methods: {
    displayedUrl (url) {
      let hostname
      let urlParts = url.split('/')
      let rest
      if (url.indexOf('//') > -1) {
        hostname = urlParts[2]
        rest = urlParts[3]
      } else {
        hostname = urlParts[0]
        rest = urlParts[1]
      }
      hostname = hostname.split(':')[0]
      hostname = hostname.split('?')[0]

      if (rest) {
        hostname += ' ...'
      }
      return hostname
    },

    /* Stringify spoken languages depending on current UI langugage */
    stringifySpokenLanguages (spokenLanguages) {
      const languageKey = this.$i18n.locale
      let spokenLanguagesResult = []
      if (spokenLanguages && spokenLanguages.split(',')) {
        const langCodes = spokenLanguages.split(',')
        for (let langCode of langCodes) {
          const langObject = Languages.getLanguageFromCode(langCode)
          spokenLanguagesResult.push(langObject[languageKey])
        }
      }
      return spokenLanguagesResult.join(', ')
    },

    removeContact (contact) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Kontakt löschen',
        message: 'Soll der Kontakt gelöscht werden?'
      }).then(result => {
        if (result === 'yes') {
          this.item.$rels.contacts.Query.delete(contact).then(result => {
            this.item.$rels.contacts.refetch()
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Kontakt erfolgreich gelöscht.'
              })
            }
          })
        }
      })
    },

    mapCenter (location) {
      if (location.lat) {
        return [location.lat, location.lon]
      } else {
        return [51.0571904, 13.7154319]
      }
    },

    linkContact (contact) {
      this.item.$rels.contacts.Query.attach(contact).then(result => {
        if (result) {
          this.$store.dispatch('messages/showAlert', {
            description: 'Der Kontakt wurde gespeichert.'
          })
          this.item.$rels.contacts.refetch()
        }
      })
    },

    unlinkContact () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Kontakt entfernen',
        message: 'Soll der Kontakt wieder entfernt werden?'
      }).then(result => {
        if (result === 'yes') {
          this.item.$rels.contacts.Query.detach(this.contact).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Der Kontakt wurde wieder entfernt.'
              })
              this.item.$rels.contacts.refetch()
            }
          })
        }
      })
    }
  },

  components: {
    LocationMap,
    ContactSelector
  }
}
</script>

<style lang="scss" scoped>
.contactList {
  &__title {
    font-size: 1.6em;
  }
}

.entryDetailSection:not(:first-child) {
  margin-top: 5em;
}

.noContact {
  margin-bottom: 1em;
}

.createContactLink {
  margin-top: .5em;
}

.contactSection {
  .entryDetailProperty {
    margin-top: 2em;
  }
}

.contact {
  &__title {
    font-size: 1.2em;
  }
}
</style>
