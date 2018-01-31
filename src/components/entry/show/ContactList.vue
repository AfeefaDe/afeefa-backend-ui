<template>
  <div>
    <div v-for="contact in item.contacts" :key="contact.id">

      <ul class="entryDetail" v-if="contact.location">
        <li v-if="location.isEmpty()" class="entryDetail__error">
            {{ $t('errors.noLocationPresent') }}
        </li>
        <li v-else>
          <entry-detail-property v-if="!location.isEmpty()" :name="$t('entries.address')" :iconName="'location_on'">
            <span v-if="location.placename">{{ location.placename }}<br></span>
            <span v-if="location.street">{{ location.street }}<br></span>
            <span v-if="location.zip || location.city">{{ location.zip }} {{ location.city }}</span>
            <location-map :map-center="mapCenter" :initial-zoom="13" :location="location" :currentTab="currentTab" style="max-width:400px"></location-map>
          </entry-detail-property>

          <entry-detail-property
            v-if="location.directions"
            :name="$t('entries.directions')"
            :iconName="'train'"
            :isMultiline="true">
            {{ location.directions }}
          </entry-detail-property>
        </li>
      </ul>

      <ul>
        <li v-for="person in contact.persons" :key="person.id">
          <entry-detail-property
            :name="person.role || $t('headlines.contact')"
            :iconName="'mail_outline'">
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
  </div>
</template>

<script>
import Languages from '@/helpers/iso_639_languages.js'
import EntryDetailProperty from './EntryDetailProperty'
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
    }
  },

  computed: {
    mapCenter () {
      if (this.location && this.location.lat) {
        return [this.location.lat, this.location.lon]
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
