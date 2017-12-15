<template>
  <div>
  <div class="inputField__spacing input-field">
    <textarea v-model="value" :id="textareaID" class="materialize-textarea"></textarea>
  </div>
  <div class="overlay" v-if="entrySelector.visible" @keyup.esc="closeOverlay">
    <div class="entrySelector">
      <label>Bitte wähle eine Organisation aus</label>
      <multiselect
        v-model="entrySelector.selectedEntry"
        :options="entrySelector.orgasSimplified"
        label="title"
        track-by="id"
        @input="orgaSelected"
        :multiple="false"
        :searchable="true"

        :placeholder="$t('multiselect.noSelection')"
        :selectLabel="$t('multiselect.selectLabel')"
        :selectedLabel="$t('multiselect.selectedLabel')"
        :deselectLabel="$t('multiselect.deselectLabel')">
      </multiselect>
      <br><a @click="closeOverlay" href="#">Abbrechen</a>
    </div>
  </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import sortByTitle from '@/helpers/sort-by-title'
import Orgas from '@/resources/Orgas'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'

import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'

export default {
  data: function () {
    return {
      textareaID: 'description',
      orgas: [],
      entrySelector: {
        visible: false,
        selectedEntry: null,
        orgasSimplified: []
      }
    }
  },
  components: {
    Multiselect
  },
  props: {
    value: {
      default: ''
    },
    toolbar1: {
      default: 'formatselect | bold italic strikethrough forecolor backcolor | bullist numlist | link  unlink | alignleft aligncenter alignright alignjustify | mybutton'
    },
    otherProps: {
      default: ''
    }
  },
  created () {
    Orgas.getAll().then(orgas => {
      this.orgas = sortByTitle(orgas)
    })
  },
  watch: {
    /*
     * simplify orga list by removing circular references
     */
    'orgas' (orgas) {
      let result = []
      for (let orga of this.orgas) {
        result.push({title: orga.title, id: orga.id})
      }
      this.entrySelector.orgasSimplified = result
    }
  },
  mounted () {
    // inspired by https://github.com/mbouclas/tinymce-vue-2
    tinymce.init({
      selector: `#${this.textareaID}`,
      skin: false,
      height: '450',
      plugins: ['link', 'lists'],
      toolbar1: this.toolbar1,
      menubar: '',
      content_css: [],
      setup: (editor) => {
        editor.addButton('mybutton', {
          text: 'Insert Orga',
          icon: false,
          onclick: this.insertOrga
        })
      },
      init_instance_callback: (editor) => {
        editor.on('KeyUp', (e) => {
          this.$emit('input', editor.getContent())
        })
        editor.on('Change', (e) => {
          this.$emit('input', editor.getContent())
        })
        editor.setContent(this.value)
      },
      ...this.otherProps
    })
  },
  destroyed () {
    tinymce.get(this.textareaID).destroy()
    this.closeOverlay()
  },
  methods: {
    insertOrga: function (editor) {
      this.entrySelector.visible = true
    },
    orgaSelected: function () {
      let editor = tinymce.activeEditor
      const id = this.entrySelector.selectedEntry.id
      const text = editor.selection.getContent({'format': 'html'})
      if (text && text.length > 0) {
        console.log('Text: ', text)
        editor.execCommand('mceInsertContent', false, `<a href="afeefa://orga/${id}">` + text + '</a>')
      }
      this.closeOverlay()
    },
    closeOverlay: function () {
      this.entrySelector.selectedEntry = null
      this.entrySelector.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~variables";
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.58);
}
.entrySelector {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: 90%;
  background: white;
  padding: 1em;
}
</style>
