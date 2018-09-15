<template>
  <afeefa-page>

    <afeefa-header slot="header">
      <div slot="title">
        Kapitel
      </div>

      <div slot="buttons" v-if="item">
        <a v-if="item.id" :href="previewLink" target="_blank" class="btn btn-medium">
          <i class="material-icons left">link</i>
          {{$t('headlines.preview')}}
        </a>
        <router-link :to="{name: 'chapters.list'}" class="btn gray btn-medium">
          <i class="material-icons left">cancel</i>
          {{ $t('buttons.cancel') }}
        </router-link>
      </div>
    </afeefa-header>

    <div slot="content" v-if="item">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <input-field
          field-name="title"
          v-model="item.title"
          validate="max:150"
          :label="$t('entries.title')" />

        <chapter-editor :value="item.content" @input="updateContent"></chapter-editor>


        <entry-edit-footer
          :item="item"
          :routeConfig="routeConfig"
          :urls="{cancel: {name: 'chapters.list'}}"
          @remove="remove"
          @save="save" />


        <br>
        <section class="entryForm__actionFooter">
          <button class="btn waves-effect waves-light green" type="submit">
            <i class="material-icons left">done</i>
            Speichern
          </button>
          <button type="button" class="btn waves-effect waves-light red" @click.prevent="remove" v-if="item.id">
            <i class="material-icons left">delete</i>
            Löschen
          </button>
        </section>
      </form>
    </div>

    <div slot="content" v-else>
      <div class="mainCard__header mainCard__headerLight">
        <span v-if="loadingError">Das Kapitel konnte nicht geladen werden.</span>
        <span v-else>Lade Kapitel ...</span>
      </div>
    </div>

  </afeefa-page>
</template>

<script>
import ChapterEditor from './ChapterEditor'
import ChapterRouteConfig from './ChapterRouteConfig'
import GenerateFrontendLinkMixin from '@/components/mixins/GenerateFrontendLinkMixin'
import Chapter from '@/models/Chapter'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

export default {
  props: ['id'],

  mixins: [GenerateFrontendLinkMixin],

  data () {
    return {
      item: null,
      loadingError: false,
      routeConfig: new ChapterRouteConfig(this, this.id)
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
      if (this.item && this.item.hasChanges()) {
        return 'Soll das Ändern des Kapitels beendet werden?'
      }
      return true
    },

    loadChapter () {
      if (this.id) { // edit
        Chapter.Query.get(this.id).then(chapter => {
          if (chapter) {
            this.item = chapter.clone()
          } else {
            console.log('error loading item')
            this.loadingError = true
          }
        })
      } else { // create
        // create a cloned chapter to later detect changes
        this.item = new Chapter().clone()
      }
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

        Chapter.Query.save(this.item).then(chapter => {
          this.$store.dispatch('messages/showAlert', {
            description: `Das Kapitel "${this.item.title}" wurde geändert.`
          })
          this.$router.push({name: 'chapters.list'})
        })
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Kaptitel löschen',
        message: `Soll das Kaptiel "${this.item.title}" gelöscht werden?`
      }).then(result => {
        if (result === 'yes') {
          Chapter.Query.delete(this.item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Das Kapitel wurde gelöscht.'
              })
              this.$router.push({name: 'chapters.list'})
            }
          })
        }
      })
    }
  },

  components: {
    ChapterEditor,
    EntryEditFooter
  }
}
</script>
