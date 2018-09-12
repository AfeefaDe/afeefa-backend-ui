<template>
  <div class="customMultiselect">
    <multiselect
      v-model="chosenLanguages"
      track-by="iso639v1"
      :options="possibleLanguages"
      :searchable="true"
      :allow-empty="true"
      :multiple="true"
      :close-on-select="false"
      @input="chosenLanguagesChanged"

      :label="$i18n.locale"
      :selectLabel="''"
      :selectedLabel="''"
      :deselectLabel="''"
      :placeholder="placeholder"
      >
      <span slot="noResult" v-if="false">{{$t('multiselect.noResult')}}</span>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Languages from '@/helpers/iso_639_languages.js'

export default {
  props: ['entryValue', 'inheritedValues'],
  components: {
    Multiselect
  },
  data () {
    return {
      chosenLanguages: [],
      possibleLanguages: Languages.data,
      placeholder: ''
    }
  },
  created () {
    if (this.entryValue && this.entryValue.split(',')) {
      const languages = this.entryValue.split(',')
      for (let langCode of languages) {
        const langObject = Languages.getLanguageFromCode(langCode)
        if (langObject) {
          this.chosenLanguages.push(langObject)
        }
      }
    }
    this.updatePlaceholderText()
  },
  watch: {
    inheritedValues () {
      this.updatePlaceholderText()
    }
  },
  methods: {
    /*
     * sets the placeholder value depending on the inherited values and the chosen languages
     */
    updatePlaceholderText () {
      if (this.inheritedValues && this.chosenLanguages.length === 0) {
        let result = []
        for (let langCode of this.inheritedValues.split(',')) {
          result.push(Languages.getLanguageFromCode(langCode)[this.$i18n.locale])
        }
        this.placeholder = result.join(', ')
      } else {
        this.placeholder = this.$tc('headlines.spokenLanguages', 2)
      }
    },
    chosenLanguagesChanged () {
      // the chosenLanguages could change to [] so we have to update our placeholder text
      this.updatePlaceholderText()
      let langs = []
      for (let language of this.chosenLanguages) {
        langs.push(language.iso639v1)
      }
      this.$emit('input', langs.join())
    }
  }
}
</script>
