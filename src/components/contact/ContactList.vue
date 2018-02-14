<template>
  <div class="contactList">
    <h3 class="contactList__title">{{$tc('headlines.contact', item.contacts.length)}}</h3>
    <div v-for="(contact, index) in item.contacts" :key="contact.id">

      <h4 v-if="index" class="contact__title">{{ contact.title || 'Weiterer Kontakt' }} </h4>
      <h4 v-else class="contact__title">{{ contact.title || 'Kontakt' }} </h4>

      <router-link :to="{name: item.type + '.contactedit', params: {contactId: contact.id}}">
        Kontakt ändern
      </router-link>
      <a href="" @click.prevent="removeContact(contact)">Kontakt löschen</a>

      <ul class="entryDetail" v-if="contact.location">
        <li v-if="contact.location.isEmpty()" class="entryDetail__error">
            {{ $t('errors.noLocationPresent') }}
        </li>
        <li v-else>
          <entry-detail-property v-if="!contact.location.isEmpty()" :name="$t('entries.address')" :iconName="'location_on'">
            <span v-if="contact.location.title">{{ contact.location.title }}<br></span>
            <span v-if="contact.location.street">{{ contact.location.street }}<br></span>
            <span v-if="contact.location.zip || contact.location.city">
              {{ contact.location.zip }} {{ contact.location.city }}
            </span>
            <location-map
              :map-center="mapCenter(contact.location)"
              :initial-zoom="13"
              :location="contact.location"
              style="max-width:400px;">
            </location-map>
          </entry-detail-property>

          <entry-detail-property
            v-if="contact.location.directions"
            :name="$t('entries.directions')"
            :iconName="'train'"
            :isMultiline="true">
            {{ contact.location.directions }}
          </entry-detail-property>
        </li>
      </ul>

      <ul>
        <li v-for="(person, index) in contact.contact_persons" :key="person.id">
          <entry-detail-property
            :name="person.role || $t('headlines.contact')"
            :iconName="index ? '' : 'mail_outline'">
              <span v-if="person.name">{{ person.name }}<br></span>
              <span v-if="person.phone">{{ person.phone }}<br></span>
              <span v-if="person.mail">{{ person.mail }}<br></span>
          </entry-detail-property>
        </li>
      </ul>

      <ul class="entryDetail">
        <li>
          <entry-detail-property
            v-if="contact.openingHours"
            :name="$t('entries.openingHours')"
            :iconName="'access_time'"
            :isMultiline="true">
            <div v-if="contact.openingHours">{{ contact.openingHours }}</div>
          </entry-detail-property>

          <entry-detail-property
            v-if="contact.fax"
            :name="$t('entries.fax')"
            :iconName="'filter_none'"
            :isMultiline="true">
            <div v-if="contact.fax">{{ contact.fax }}</div>
          </entry-detail-property>

          <entry-detail-property
            v-if="contact.spokenLanguages"
            :name="$tc('headlines.spokenLanguages', contact.spokenLanguages.split(',').length)"
            :iconName="'translate'">
              {{ stringifySpokenLanguages(contact.spokenLanguages) }}
          </entry-detail-property>

          <entry-detail-property
            :name="'Links'"
            :iconName="'link'"
            v-if="contact.web || contact.socialMedia">
              <span v-if="contact.web">
                <a :href="contact.web" target="_blank">{{ contact.web }}</a><br>
              </span>
              <span v-if="contact.socialMedia">
                <a :href="contact.socialMedia" target="_blank">{{ contact.socialMedia }}</a>
              </span>
          </entry-detail-property>
        </li>
      </ul>
    </div>

    <router-link :to="{name: item.type + '.contactnew'}">
      Weiteren Kontakt hinzufügen
    </router-link>
  </div>
</template>

<script>
import Languages from '@/helpers/iso_639_languages.js'

import Contact from '@/models/Contact'

import EntryDetailProperty from '@/components/entry/show/EntryDetailProperty'
import LocationMap from '@/components/Map'

export default {
  props: ['item'],

  methods: {
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
          Contact.delete(this.item, contact).then(result => {
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
    }
  },

  components: {
    EntryDetailProperty,
    LocationMap
  }
}
</script>

<style lang="scss" scoped>
.contactList {
  &__title {
    font-size: 1.6em;
  }
}
.contact {
  &__title {
    font-size: 1.2em;
  }
}
</style>
