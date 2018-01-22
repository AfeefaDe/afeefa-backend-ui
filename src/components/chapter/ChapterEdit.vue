<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div v-bind:class="['mainCard__header', 'mainCard__headerCategories']" v-if="item">
          <div class="mainCard__headerTitle">
            <h2 class="mainCard__headerTitle"> {{item.title || 'Kein Titel'}}</h2>
          </div>
          <div class="mainCard__headerButtonContainer">
            <a v-if="item.id" :href="previewLink" target="_blank" class="mainCard__headerButton">
              {{$t('headlines.preview')}}
              <i class="material-icons">link</i>
            </a>
            <a href="" @click.prevent="cancel" class="mainCard__headerAction"><i class="material-icons">cancel</i></a>
          </div>
        </div>

        <div v-if="item">
          <form @submit.prevent="save" class="entryForm" novalidate>

            <div class="inputField__spacing input-field">
              <label for="title" :class="{active: item.title}">
                {{ $t('entries.title') }}
                <span class="labelCharacterCount" v-if="item.title.length">{{item.title.length}}/150</span>
              </label>
              <input v-model="item.title" id="title" type="text"
                name="title" :data-vv-as="$t('entries.title')" v-validate.initial="'required|max: 150'"
                :class="{'validation-error': errors.has('title') }"/>
              <span v-show="errors.has('title')" class="validation-error">{{ errors.first('title') }}</span>
            </div>

            <chapter-editor :value="item.content" v-on:input="updateContent"></chapter-editor>

            <br>
            <section class="entryForm__actionFooter">
              <button v-bind:class="[{disabled: currentlySaving}, 'btn', 'waves-effect', 'waves-light', 'saveButton']" type="submit">
                <i class="material-icons left">done</i>
                Speichern
              </button>
              <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="item.id">
                <i class="material-icons left">delete</i>
                Löschen
              </button>
            </section>
          </form>
        </div>

        <div v-else class="mainCard">
          <div class="mainCard__header mainCard__headerLight">
            <span v-if="loadingError">Das Kapitel konnte nicht geladen werden.</span>
            <span v-else>Lade Kapitel ...</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ChapterEditor from './ChapterEditor'
import GenerateFrontendLinkMixin from '@/components/mixins/GenerateFrontendLinkMixin'
import Chapter from '@/models/Chapter'
import Chapters from '@/resources/Chapters'

export default {
  props: ['id'],
  mixins: [GenerateFrontendLinkMixin],
  components: {
    ChapterEditor
  },
  data () {
    return {
      item: null,
      origItem: null,
      loadingError: false,
      currentlySaving: false
    }
  },
  computed: {
    previewLink () {
      return `${this.frontendURL}/chapter/${this.item.id}`
    }
  },
  created () {
    this.loadChapter()
  },

  methods: {
    updateContent (content) {
      this.item.content = content
    },
    $canLeaveRoute () {
      const hashOrig = JSON.stringify(this.origItem.serialize())
      const hashItem = JSON.stringify(this.item.serialize())
      if (hashOrig === hashItem) {
        return true
      }

      return 'Soll das Ändern des Kapitels beendet werden?'
    },

    loadChapter () {
      if (this.id) { // edit
        Chapters.get(this.id).then(chapter => {
          if (chapter) {
            this.origItem = chapter
            this.item = chapter.clone()
          } else {
            console.log('error loading item')
            this.loadingError = true
          }
        })
      } else { // create
        this.origItem = new Chapter()
        this.item = this.origItem.clone()
      }
    },

    cancel () {
      this.$router.push({name: 'chapters.list'})
    },

    save () {
      this.$validator.setLocale(this.$i18n.locale)

      this.$validator.validateAll().then(result => {
        if (!result) {
          const errorBag = this.$validator.errors
          let errorString = '\n\n'
          for (let error of errorBag.items) {
            errorString += error.msg + '\n'
          }
          this.$store.dispatch('messages/showAlert', {
            isError: true,
            autoHide: false,
            description: 'Es sind leider noch Fehler im Formular!' + errorString
          })
          return
        }

        this.currentlySaving = true
        Chapters.save(this.item).then(chapter => {
          this.$store.dispatch('messages/showAlert', {
            description: `Das Kapitel "${this.item.title}" wurde geändert.`
          })
          this.origItem = this.item // prevent route leave dialog after save
          this.$router.push({name: 'chapters.list'})
        }).finally(() => {
          this.currentlySaving = false
        })
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Kaptitel löschen',
        message: `Soll das Kaptiel "${this.item.title}" gelöscht werden?`
      }).then(result => {
        if (result === 'yes') {
          Chapters.delete(this.item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Das Kapitel wurde gelöscht.'
              })
              this.origItem = this.item // prevent route leave dialog after save
              this.$router.push({name: 'chapters.list'})
            }
          })
        }
      })
    }
  }

}
</script>
