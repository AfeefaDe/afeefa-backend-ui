<template>
  <div>
    <ul class="entryDetail" v-if="location">
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

    <ul class="entryDetail" v-if="contactInfo">
      <li v-if="contactInfo.isEmpty() && !inheritedContactInfo" class="entryDetail__error">
        {{ $t('errors.noContactPresent') /* not inherited and empty */}}
      </li>
      <li v-else-if="inheritedContactInfo && contactInfo.isEmpty() && parentOrga && parentOrga.contact && parentOrga.contact.isEmpty()"  class="entryDetail__error">
        {{ $t('errors.noContactPresent') /* inherited but parent and child are empty */}}
      </li>
      <li v-else>
        <entry-detail-property
          :name="$t('headlines.contact')"
          :iconName="'mail_outline'"
          v-if="contactInfo.person || contactInfo.phone || contactInfo.fax || contactInfo.mail || showInheritValue('person') || showInheritValue('phone') || showInheritValue('mail')">
            <span v-if="contactInfo.person">{{ contactInfo.person }}<br></span>
            <span class="inheritedValue" v-else-if="showInheritValue('person')">{{ showInheritValue('person') }}<br></span>

            <span v-if="contactInfo.phone">{{ contactInfo.phone }} (Telefon)<br></span>
            <span class="inheritedValue" v-else-if="showInheritValue('phone')">{{ showInheritValue('phone')}} (Telefon)<br></span>

            <span v-if="contactInfo.fax">{{ contactInfo.fax }} (Fax)<br></span>
            <span class="inheritedValue" v-else-if="showInheritValue('fax')">{{ showInheritValue('fax')}} (Fax)<br></span>

            <a v-if="contactInfo.mail" :href="'mailto:' + contactInfo.mail">{{ contactInfo.mail }}</a>
            <a class="inheritedValue" v-else-if="showInheritValue('mail')" :href="'mailto:'+ showInheritValue('mail')">{{ showInheritValue('mail')}}</a>
        </entry-detail-property>

        <entry-detail-property
          v-if="contactInfo.openingHours || showInheritValue('openingHours')"
          :name="$t('entries.openingHours')"
          :iconName="'access_time'"
          :isMultiline="true">
          <div v-if="contactInfo.openingHours">{{ contactInfo.openingHours }}</div>
          <div v-else class="inheritedValue">{{showInheritValue('openingHours')}}</div>
        </entry-detail-property>

        <entry-detail-property
          :name="'Links'"
          :iconName="'link'"
          v-if="contactInfo.web || contactInfo.socialMedia || showInheritValue('web') || showInheritValue('socialMedia')">
            <span v-if="contactInfo.web">
              <a :href="contactInfo.web" target="_blank">{{ contactInfo.web }}</a><br>
            </span>
            <span v-else-if="showInheritValue('web')" class="inheritedValue">
              <a :href="showInheritValue('web')" target="_blank">{{ showInheritValue('web') }}</a><br>
            </span>

            <span v-if="contactInfo.socialMedia">
              <a :href="contactInfo.socialMedia" target="_blank">{{ contactInfo.socialMedia }}</a>
            </span>
            <span v-else-if="showInheritValue('socialMedia')" class="inheritedValue" >
              <a :href="showInheritValue('socialMedia')" target="_blank">{{ showInheritValue('socialMedia') }}</a>
            </span>
        </entry-detail-property>

        <entry-detail-property
          v-if="contactInfo.spokenLanguages"
          :name="$tc('headlines.spokenLanguages', contactInfo.spokenLanguages.split(',').length)"
          :iconName="'translate'">
            {{stringifySpokenLanguages(contactInfo.spokenLanguages)}}
        </entry-detail-property>
        <entry-detail-property
          v-else-if="showInheritValue('spokenLanguages')"
          :name="$tc('headlines.spokenLanguages', showInheritValue('spokenLanguages').split(',').length)"
          :iconName="'translate'">
            <div class="inheritedValue">
              {{stringifySpokenLanguages(showInheritValue('spokenLanguages'))}}
            </div>
        </entry-detail-property>
      </li>
    </ul>
  </div>
</template>

<script>
import Languages from '@/helpers/iso_639_languages.js'
import EntryDetailProperty from './EntryDetailProperty'
import LocationMap from '@/components/Map'

export default {
  props: ['location', 'contactInfo', 'inheritedContactInfo', 'parentOrga', 'currentTab'],

  methods: {
    /* decide whereever to output the inheritaded attribute for the contact object  */
    showInheritValue (attribute) {
      if (this.inheritedContactInfo && this.parentOrga && this.parentOrga.contact && this.parentOrga.contact[attribute]) {
        return this.parentOrga.contact[attribute]
      } else {
        return false
      }
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
