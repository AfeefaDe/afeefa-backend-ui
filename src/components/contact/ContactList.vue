<template>
  <div>
    <div v-if="!contact">
      <entry-detail-section
        class="contactSection"
        :title="$t('headlines.contact')"
        icon="mail_outline">

        <create-button-box
          entryType="contacts"
          action="selectEntry"
          alternativeAction="createEntry"
          :selector="ContactSelector"
          @select="linkContact"
          @alternativeAction="$router.push({name: item.type + '.contactnew'})" />

      </entry-detail-section>
    </div>

    <entry-detail-section
      v-if="contact"
      :title="$t('headlines.contact')"
      class="contactSection"
      icon="mail_outline"
      :editLink="isOwnContact ? contactEditRoute : ''">

      <div v-if="contact && !isOwnContact">
        <info-box>
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
        </info-box>
      </div>

      <entry-detail-property
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
      </entry-detail-property>

      <div
        v-if="contact && hasContactAttributes"
        class="contactSection">
        <entry-detail-property
          v-for="person in contact.contact_persons" :key="person.id"
          :title="person.role || 'Kontaktperson'">
          <div v-if="person.name">{{ person.name }}</div>
          <div v-if="person.phone">{{ person.phone }}</div>
          <div v-if="person.mail"><a :href="'mailto: ' + person.mail">{{ person.mail }}</a></div>
        </entry-detail-property>

        <entry-detail-property v-if="contact.openingHours"
          :title="$t('entries.openingHours')">
          {{ contact.openingHours }}
        </entry-detail-property>

        <entry-detail-property v-if="contact.spokenLanguages"
          :title="$tc('headlines.spokenLanguages', contact.spokenLanguages.split(',').length)">
          {{ stringifySpokenLanguages(contact.spokenLanguages) }}
        </entry-detail-property>

        <entry-detail-property v-if="hasLinks" title="Links">
          <div v-if="contact.web" class="urlContainer">
            <a :href="contact.web" target="_blank">{{ displayedUrl(contact.web) }}</a><br>
          </div>
          <div v-if="contact.socialMedia" class="urlContainer">
            <a :href="contact.socialMedia" target="_blank">{{ displayedUrl(contact.socialMedia) }}</a>
          </div>
        </entry-detail-property>
      </div>
    </entry-detail-section>
  </div>
</template>

<script>
import Languages from '@/helpers/iso_639_languages.js'
import LocationMap from '@/components/Map'
import ContactSelector from '@/components/actor/ContactSelector'
import textEllipsize from '@/filters/text-ellipsize'

export default {
  props: ['item'],

  data () {
    return {
      ContactSelector
    }
  },

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
    },

    hasContactAttributes () {
      const hasPerson = this.contact.contact_persons.some(cp => !cp.isEmpty())
      return this.contact.openingHours || this.contact.spokenLanguages || hasPerson
    },

    hasLinks () {
      return this.contact.web || this.contact.socialMedia
    }
  },

  methods: {
    displayedUrl (url) {
      return textEllipsize(url, 60)
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
    LocationMap
  }
}
</script>

<style lang="scss" scoped>
.entryDetailSection:not(:first-child) {
  margin-top: 5em;
}

.linkedContactOwner + .entryDetailSection {
  margin-top: 3em;
}

.infoBox {
  margin-top: 1.5em;
}

.createContactLink {
  margin-top: .5em;
}

.contactSection {
  .entryDetailProperty {
    margin-top: 1em;
    &:not(:first-child) {
      margin-top: 1.5em;
    }
  }
}

.urlContainer {
  display: table;
  table-layout: fixed;
  width: 100%;
  word-wrap: break-word;

  + .urlContainer {
    margin-top: .4em;
  }
}
</style>
