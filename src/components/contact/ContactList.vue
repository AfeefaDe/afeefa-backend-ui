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
            <button type="button" class="btn btn-small">
              Kontakt finden
            </button>
          </contact-selector>
        </div>

        <div class="createContactLink">
          <router-link :to="{name: item.type + '.contactnew'}" class="inlineEditLink">
            Neuen Kontakt erstellen
          </router-link>
        </div>
      </entry-detail-section>
    </div>

    <div class="linkedContactOwner" v-if="contact && !isOwnContact">
      <i class="material-icons">error_outline</i>
      <div>
        <div>
          Der Kontakt wurde von
          <router-link :to="{name: contact.owner.type + '.show', params: {id: contact.owner.id}}">
            {{ contact.owner.title }}
          </router-link>
          übernommen und kann dort geändert werden.
        </div>
        <a href="" @click.prevent="unlinkContact" class="removeLink inlineEditLink">
          Verlinkten Kontakt wieder entfernen.
        </a>
      </div>
    </div>

    <entry-detail-section
      v-if="location"
      :title="$tc('entries.address')"
      icon="location_on"
      :editLink="isOwnContact ? contactEditRoute : ''">

      <div v-if="locationTitle">{{ locationTitle }}</div>
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
    },

    locationTitle () {
      if (!this.location) {
        return ''
      }

      let title = this.location.title || (this.location.owner ? this.location.owner.title : '')

      if (this.location.contact_id === this.id) {
        return title
      }

      return this.contact.location_spec || title
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
          if (langObject) {
            spokenLanguagesResult.push(langObject[languageKey])
          }
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

.linkedContactOwner + .entryDetailSection {
  margin-top: 3em;
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

.linkedContactOwner {
  font-size: .9em;
  margin-left: 60px;
  max-width:400px;

  display: flex;
  align-items: center;
  width: 80%;
  border: 1px solid $gray20;
  padding: .8em;

  i {
    font-size: 20px;
    margin-right: .6em;
  }

  .removeLink {
    display: block;
    margin-top: .4em;
    font-size: 1em;
  }
}
</style>
