<template>
  <div class="inputField__spacing" v-if="contactInfo">
    <div v-if="parentOrga && parentOrga.contact && !parentOrga.contact.isEmpty()" class="input-field">
      <input class="filled-in" id="inhContact" type="checkbox" @click="updateInheritanceState" v-model="inheritedContactInfo">
      <label v-if="type === 'orgas'" for="inhContact">{{$t('checkboxes.contact_infos_inheritance_orga')}}</label>
      <label v-else for="inhContact">{{$t('checkboxes.contact_infos_inheritance_event')}}</label>
    </div>

    <div class="input-field">
      <label for="mail" :class="{active: contactInfo.mail || showInheritValue('mail')}">E-Mail</label>
      <input id="mail" type="email"
        v-model="contactInfo.mail"
        name="email"
        data-vv-validate-on="blur"
        data-vv-as="E-Mail"
        v-validate="'email'"
        :class="{'validation-error': errors.has('email') }"
        :placeholder="showInheritValue('mail')"/>
      <span v-show="errors.has('email')" class="validation-error">{{ errors.first('email') }}</span>
    </div>

    <div class="input-field">
      <label for="phone" :class="{active: contactInfo.phone || showInheritValue('phone')}">Telefon</label>
      <input v-model="contactInfo.phone" name="phone" data-vv-as="Telefon" v-validate.initial="'max: 255'" :placeholder="showInheritValue('phone')" id="phone" type="text" />
      <span v-show="errors.has('phone')" class="validation-error">{{ errors.first('phone') }}</span>
    </div>

    <div class="input-field">
      <label for="fax" :class="{active: contactInfo.fax || showInheritValue('fax')}">Fax</label>
      <input v-model="contactInfo.fax" name="fax" data-vv-as="Fax" v-validate.initial="'max: 255'" :placeholder="showInheritValue('fax')" id="fax" type="text" />
      <span v-show="errors.has('fax')" class="validation-error">{{ errors.first('fax') }}</span>
    </div>

    <div class="input-field">
      <label for="contactPerson" :class="{active: contactInfo.person || showInheritValue('person')}">Kontaktperson</label>
      <input v-model="contactInfo.person" :placeholder="showInheritValue('person')" id="contactPerson" type="text"/>
    </div>

    <div class="inputField__spacing input-field" v-if="type === 'orgas'">
      <label for="openingHours" :class="{active: contactInfo.openingHours || showInheritValue('openingHours')}">
        {{ $t('entries.openingHours') }}
      </label>
      <textarea v-model="contactInfo.openingHours" :placeholder="showInheritValue('openingHours')" id="openingHours"
        class="materialize-textarea"></textarea>
    </div>

    <div class="input-field">
      <label for="web" :class="{active: contactInfo.web || showInheritValue('web')}">{{ $t('entries.web') }}</label>
      <input id="web"
            type="text"
            v-model="contactInfo.web"
            name="web"
            data-vv-validate-on="blur"
            data-vv-as="Homepage"
            v-validate="'url-with-protocol'"
            :class="{'validation-error': errors.has('web') }"
            :placeholder="showInheritValue('web')"/>
      <span v-show="errors.has('web')" class="validation-error">{{ errors.first('web') }}</span>
    </div>

    <div class="input-field">
      <label for="socialMedia" :class="{active: contactInfo.socialMedia || showInheritValue('socialMedia')}">
        {{ $t('entries.socialMedia') }}
      </label>
      <input id="socialMedia"
            type="text"
            v-model="contactInfo.socialMedia"
            name="socialMedia"
            data-vv-validate-on="blur"
            v-validate="'url-with-protocol'"
            data-vv-as="Social Media"
            :class="{'validation-error': errors.has('socialMedia') }"
            :placeholder="showInheritValue('socialMedia')"/>
    </div>
    <span v-show="errors.has('socialMedia')" class="validation-error">{{ errors.first('socialMedia') }}</span>

    <lang-select-input  @input="updateSpokenLanguages" :inheritedValues="showInheritValue('spokenLanguages')" :entryValue="contactInfo.spokenLanguages"></lang-select-input>

  </div>
</template>

<script>
import LangSelectInput from './LangSelectInput'
import ValidationMixin from '@/components/mixins/ValidationMixin'


export default {
  props: ['contactInfo', 'inheritanceState', 'type', 'parentOrga'],
  mixins: [ValidationMixin],
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
    LangSelectInput
  }
}
</script>
