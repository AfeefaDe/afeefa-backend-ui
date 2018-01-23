<template>
  <div class="inputField__spacing" v-if="contactInfo">
    <div v-if="parentOrga && parentOrga.contact && !parentOrga.contact.isEmpty()" class="input-field">
      <input class="filled-in" id="inhContact" type="checkbox" @click="updateInheritanceState" v-model="inheritedContactInfo">
      <label v-if="type === 'orgas'" for="inhContact">{{$t('checkboxes.contact_infos_inheritance_orga')}}</label>
      <label v-else for="inhContact">{{$t('checkboxes.contact_infos_inheritance_event')}}</label>
    </div>

    <input-field
      class="inputField__spacing"
      field-name="mail"
      v-model="contactInfo.mail"
      :placeholder="showInheritValue('mail')"
      validate="email"
      validate-on-blur="true"
      label="E-Mail">
    </input-field>

    <input-field
      field-name="phone"
      v-model="contactInfo.phone"
      :placeholder="showInheritValue('phone')"
      validate="max:255"
      label="Telefon">
    </input-field>

    <input-field
      field-name="fax"
      v-model="contactInfo.fax"
      :placeholder="showInheritValue('fax')"
      validate="max:255"
      label="Fax">
    </input-field>

    <input-field
      field-name="person"
      v-model="contactInfo.person"
      :placeholder="showInheritValue('person')"
      validate="max:255"
      label="Kontaktperson">
    </input-field>

    <div class="inputField__spacing input-field" v-if="type === 'orgas'">
      <label for="openingHours" :class="{active: contactInfo.openingHours || showInheritValue('openingHours')}">
        {{ $t('entries.openingHours') }}
      </label>
      <textarea
        v-model="contactInfo.openingHours"
        :placeholder="showInheritValue('openingHours')"
        id="openingHours"
        class="materialize-textarea"
        v-autosize>
      </textarea>
    </div>

    <input-field
      field-name="web"
      v-model="contactInfo.web"
      :placeholder="showInheritValue('web')"
      validate="url-with-protocol"
      validate-on-blur="true"
      label="Homepage">
    </input-field>

    <input-field
      field-name="socialMedia"
      v-model="contactInfo.socialMedia"
      :placeholder="showInheritValue('socialMedia')"
      validate="url-with-protocol"
      validate-on-blur="true"
      label="Social Media">
    </input-field>

    <lang-select-input  @input="updateSpokenLanguages" :inheritedValues="showInheritValue('spokenLanguages')" :entryValue="contactInfo.spokenLanguages"></lang-select-input>

  </div>
</template>

<script>
import LangSelectInput from './LangSelectInput'
import ValidationMixin from '@/components/mixins/ValidationMixin'
import InputField from '@/components/InputField'

export default {
  mixins: [ValidationMixin],

  props: ['contactInfo', 'inheritanceState', 'type', 'parentOrga'],

  data () {
    return {
      inheritedContactInfo: false
    }
  },

  created () {
    this.inheritedContactInfo = this.inheritanceState
  },

  methods: {
    /* decide whereever to output the inheritaded attribute for the contact object */
    showInheritValue (attribute) {
      if (this.inheritedContactInfo && this.parentOrga && this.parentOrga.contact && this.parentOrga.contact[attribute]) {
        return this.parentOrga.contact[attribute]
      } else {
        return false
      }
    },

    updateSpokenLanguages (spokenLanguages) {
      this.contactInfo.spokenLanguages = spokenLanguages
    },

    updateInheritanceState () {
      this.$emit('input', this.inheritedContactInfo)
    }
  },

  components: {
    LangSelectInput,
    InputField
  }
}
</script>
