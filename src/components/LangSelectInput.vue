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
      :selectLabel="$t('multiselect.selectLabel')"
      :selectedLabel="$t('multiselect.selectedLabel')"
      :deselectLabel="$t('multiselect.deselectLabel')"
      :placeholder="$tc('headlines.spokenLanguages', 2)"
      >
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Languages from '@/helpers/iso_639_languages.js'

export default {
  props: ['entryValue'],
  components: {
    Multiselect
  },
  data () {
    return {
      chosenLanguages: [],
      possibleLanguages: Languages.data
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
  },
  methods: {
    chosenLanguagesChanged () {
      let langs = []
      for (let language of this.chosenLanguages) {
        langs.push(language.iso639v1)
      }
      this.$emit('input', langs.join())
    }
  }
}
</script>

<style lang="scss">
  @import "~variables";
  .customMultiselect {
    .multiselect__tags {
      border: 0;
      padding-left: 0;
    }
    .multiselect__option--highlight, .multiselect__option--highlight:after {
      background: $turquoise;
    }
    .multiselect__tag {
      background: $turquoise;
      padding: 8px 26px 8px 14px;
      i:after {
        line-height: 30px;
      }
    }
    .multiselect__tag-icon:focus, .multiselect__tag-icon:hover {
      background: $turquoise;
    }
    .multiselect--above .multiselect__content {
      background: $gray20;
    }
  }
</style>
