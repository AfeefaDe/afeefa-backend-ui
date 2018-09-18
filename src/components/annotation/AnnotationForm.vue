<template>
  <div :class="['annotationForm', {inline}]">
    <form @submit.prevent="save" novalidate>
      <div v-if="!annotation.id">
        <input-label
          name="category" :title="$t('entries.category')"
          :validationErrors="errors" />

        <select id="category" v-model="annotation.annotationCategory" v-if="annotationCategories.length"
          :class="['browser-default', {'validation-error': errors.has('category') }]"
          name="category" data-vv-validate-on="change" :data-vv-as="$t('entries.category')" v-validate.initial="'required'">
          <option :value="null" v-if="!annotation.annotationCategory">Kategorie auswählen</option>
          <option :value="category" v-for="category in annotationCategories" :key="category.id">
            {{ category.title }}
          </option>
        </select>
      </div>

      <text-input
        :class="{formElement: !annotation.id, halfMargsinTop: !annotation.id}"
        v-model="annotation.detail"
        fieldName="detail"
        :label="$t('entries.description')"
        :placeholder="$t('entries.description')"
        validate="required|max:350"
        autoFocus="true" />

      <div class="buttons">
        <div class="buttons">
          <a href="" @click.prevent="close" class="inlineEditLink">
            Abbrechen
          </a>

          <a href="" @click.prevent="remove" v-if="annotationToEdit.id" class="inlineEditLink">
            Löschen
          </a>

          <button :class="['btn', buttonSize, 'green']" type="submit">
            {{ annotation.id ? 'Speichern' : 'Anlegen' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AnnotationCategory from '@/models/AnnotationCategory'
import InputLabel from '@/components/InputLabel'

export default {
  props: ['entry', 'annotationToEdit', 'inline'],

  data () {
    return {
      annotationCategories: [],
      annotation: null
    }
  },

  created () {
    this.annotation = this.annotationToEdit.clone()

    AnnotationCategory.Query.getAll().then(annotationCategories => {
      this.annotationCategories = annotationCategories.filter(annotationCategory => !annotationCategory.generatedBySystem)
    })
  },

  computed: {
    buttonSize () {
      return 'btn-xs' // this.inline ? 'btn-small' : 'btn-medium'
    }
  },

  methods: {
    checkClose (annotation) {
      if (annotation !== this.annotation) {
        this.close()
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

        this.entry.$rels.annotations.Query.save(this.annotation).then(() => {
          this.$emit('save')

          this.$store.dispatch('messages/showAlert', {
            description: `Die Aufgabe wurde ${this.annotation.id ? 'geändert' : 'hinzugefügt'}.`
          })
        })
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Aufgabe löschen',
        message: `Soll die Aufgabe ${this.annotation.annotationCategory.title} gelöscht werden?`
      }).then(result => {
        if (result === 'yes') {
          this.entry.$rels.annotations.Query.delete(this.annotation).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Die Aufgabe wurde gelöscht'
              })
              this.$emit('remove')
            }
          })
        }
      })
    },

    close () {
      this.$emit('close')
    }
  },

  components: {
    InputLabel
  }
}
</script>

<style lang="scss" scoped>
.annotationForm {
  width: 100%;
  margin-top: .2em;
  margin-bottom: .8em;

  input, select {
    width: auto;
    line-height: 1.5;
    height: 2em;
    padding: 0 .4em;
  }

  /deep/ textarea,
  /deep/ select,
  /deep/ label {
    margin-top: .2em;
    max-height: 100px;
  }
}

.marginTop {
  margin-top: 1.5em;
}

.buttons {
  margin-top: .3em;
  display: flex;
  align-items: baseline;
}

.btn {
  margin-top: -1px;
  padding: 0 4px;
  i {
    font-size: 1rem;
  }
}

a + button, a + a {
  margin-left: .7em;
}
</style>
