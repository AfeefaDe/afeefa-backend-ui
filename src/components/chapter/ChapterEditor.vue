<template>
  <div>
    <div class="inputField__spacing input-field">
      <textarea v-model="value" :id="textareaID" class="materialize-textarea"></textarea>
    </div>
    <transition name="chapterOverlay" tag="div">
      <div class="overlay" v-if="entrySelector.visible">
        <div class="selector">
          <label>{{$t('multiselect.selectOrga')}}</label>
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

      <div class="overlay" v-if="chapterSelector.visible">
        <div class="selector">
          <label>{{$t('multiselect.selectChapter')}}</label>
          <multiselect
            v-model="chapterSelector.selectedEntry"
            :options="chapterSelector.chapters"
            label="title"
            track-by="id"
            @input="chapterSelected"
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
    </transition>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Orga from '@/models/Orga'
import Chapter from '@/models/Chapter'
import sortByTitle from '@/helpers/sort-by-title'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'

// TinyMCE Plugins
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/wordcount'

export default {
  data: function () {
    return {
      textareaID: 'description',
      entrySelector: {
        visible: false,
        selectedEntry: null,
        orgasSimplified: []
      },
      chapterSelector: {
        visible: false,
        selectedChapter: null,
        chapters: []
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
      default: 'formatselect | bold italic strikethrough forecolor backcolor | bullist numlist | link  unlink | alignleft aligncenter alignright alignjustify | code | insertOrgaButton insertChapterButton'
    },
    otherProps: {
      default: ''
    }
  },
  created () {
    Orga.Query.getAll().then(orgas => {
      orgas = orgas.map(orga => {
        return {title: orga.title, id: orga.id}
      })
      this.entrySelector.orgasSimplified = sortByTitle(orgas)
    })

    Chapter.Query.getAll().then(chapters => {
      this.chapterSelector.chapters = chapters
    })
  },
  mounted () {
    window.addEventListener('keyup', this.onKeyUp)
    // inspired by https://github.com/mbouclas/tinymce-vue-2
    tinymce.init({
      selector: `#${this.textareaID}`,
      skin: false,
      height: '450',
      plugins: ['link', 'lists', 'code', 'wordcount'],
      toolbar1: this.toolbar1,
      menubar: '',
      content_css: [],
      setup: (editor) => {
        editor.addButton('insertOrgaButton', {
          text: this.$t('tinymce.insertOrga'),
          icon: false,
          tooltip: this.$t('tinymce.insertOrgaTooltip'),
          onclick: this.insertOrgaLink
        })
        editor.addButton('insertChapterButton', {
          text: this.$t('tinymce.insertChapter'),
          icon: false,
          onclick: this.insertChapterLink
        })
      },
      init_instance_callback: (editor) => {
        editor.setContent(this.value)
        editor.on('KeyUp', (e) => {
          this.$emit('input', editor.getContent())
        })
        editor.on('Change', (e) => {
          this.$emit('input', editor.getContent())
        })
      },
      ...this.otherProps
    })
  },
  destroyed () {
    tinymce.get(this.textareaID).destroy()
    window.removeEventListener('keyup', this.onKeyUp)
    this.closeOverlay()
  },
  methods: {
    onKeyUp () {
      if (event.keyCode === 27) {
        this.closeOverlay()
      }
    },
    /*
     * returns the current selection of the active editor
     */
    getCurrentTextSelection () {
      let editor = tinymce.activeEditor
      return editor.selection.getContent({'format': 'html'})
    },
    insertContent: function (selectedItem) {
      const id = selectedItem.id
      const title = selectedItem.title
      const text = this.getCurrentTextSelection()
      if (text && text.length > 0) {
        tinymce.activeEditor.execCommand('mceInsertContent', false, `<a title="${title}" href="afeefa://orga/${id}">${text}</a>`)
        this.entrySelector.selectedEntry = null
      }
    },
    /*
     * checks for a valid text selection and shows error message
     */
    selectionIsValid () {
      if (!this.getCurrentTextSelection()) {
        this.$store.dispatch('messages/showAlert', {
          isError: true,
          autoHide: true,
          title: this.$t('tinymce.noSelectionTitle'),
          description: this.$t('tinymce.noSelectionDescription')
        })
        return false
      } else {
        return true
      }
    },
    /*
     * click on the editor button shows orga selector
     */
    insertOrgaLink: function () {
      if (this.selectionIsValid()) {
        this.entrySelector.visible = true
      }
    },
    /*
     * click on the editor buttons shows chapter selector
     */
    insertChapterLink: function () {
      if (this.selectionIsValid()) {
        this.chapterSelector.visible = true
      }
    },
    /*
     * inserts the Orga link after selection from multiselect
     */
    orgaSelected: function () {
      this.insertContent(this.entrySelector.selectedEntry)
      this.closeOverlay()
    },
    /*
     * inserts the Chapter link after selection from multiselect
     */
    chapterSelected: function () {
      this.insertContent(this.chapterSelector.selectedEntry)
      this.closeOverlay()
    },
    closeOverlay: function () {
      this.entrySelector.visible = false
      this.chapterSelector.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.overlay {
  position: fixed;
  z-index: $z-index-overlay;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.58);
}
.selector {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, 0);
  max-width: 500px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  border-radius: 3px;
  width: 90%;
  background: white;
  padding: 1em;
}

</style>
