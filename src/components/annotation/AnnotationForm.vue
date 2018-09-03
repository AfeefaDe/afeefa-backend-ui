<template>
  <div :class="['annotationForm', {inline}]">
    <form @submit.prevent="save" novalidate>
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

      <text-input
        class="formElement marginTop"
        v-model="annotation.detail"
        fieldName="detail"
        :label="$t('entries.description')"
        :placeholder="$t('entries.description')"
        validate="required|max:350" />

      <div class="buttons">
        <button :class="['btn', buttonSize, 'gray']" type="button" @click="close">
          {{ $t('buttons.cancel') }}
        </button>

        <button :class="['btn', buttonSize, 'green']" type="submit">
          {{ annotation.id ? 'Speichern' : 'Anlegen' }}
        </button>
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
      return this.inline ? 'btn-small' : 'btn-medium'
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
.marginTop {
  margin-top: 1.5em;
}

textarea {
  max-height: 100px;
}

.buttons {
  text-align: right;
  margin-top: 2em;
}

.inline {
  .marginTop {
    margin-top: .6em;
  }
  .buttons {
    margin-top: 1em;
  }
}

.btn + .btn {
  margin-left: .6em;
}
</style>
