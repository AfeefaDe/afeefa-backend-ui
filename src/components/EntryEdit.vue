<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">

        <div class="mainCard__header mainCard__headerLight" v-if="item">
          <h2 class="mainCard__headerTitle"> {{item.title || 'Kein Titel'}}</h2>
          <a href="" @click.prevent="cancel" class="mainCard__headerAction"><i class="material-icons">cancel</i></a>
        </div>
        <div v-else>
          <div class="mainCard__header mainCard__headerLight">
            {{ messages.loading() }} ...
          </div>
        </div>

        <div v-if="item">
          <form @submit.prevent="save" class="entryForm" novalidate>

            <div class="inputField__spacing input-field">
              <label for="title" :class="{active: item.title}">Titel</label>
              <input v-model="item.title" id="title" type="text"
                data-vv-name="title" v-validate="'required'"
                :class="{'validation-error': errors.has('title') }"/>
              <span v-show="errors.has('title')" class="validation-error">{{ errors.first('title') }}</span>
            </div>

            <div class="inputField__spacing input-field">
              <label for="description" :class="{active: item.description}">Beschreibung ({{ item.description.length }} von 350 Zeichen)</span></label>
              <textarea v-model="item.description" id="description" maxlength="350"
                data-vv-name="description" v-validate="'required|max:350'"
                :class="['materialize-textarea', {'validation-error': errors.has('description') }]"></textarea>
              <span v-show="errors.has('description')" class="validation-error">{{ errors.first('description') }}</span>
            </div>

            <div class="inputField__spacing" v-if="has.orga">
              <h2>Veranstalter</h2>
              <label>Veranstalter</label>
              <select class="browser-default" v-model="item.parent_orga" v-if="orgas.length">
                <option :value="null">Kein Veranstalter</option>
                <option :value="orga" v-for="orga in orgas">{{ orga.title }}</option>
              </select>
            </div>

            <div v-if="has.date">
              <h2>{{ $t("headlines.time") }}</h2>
              <date-picker class="inputField__spacing"
                :date-start="item.date_start"
                :date-end="item.date_end"
                :has-time-start="item.has_time_start"
                :has-time-end="item.has_time_end"
                @update="updateDatePickerValues">
              </date-picker>
            </div>

            <div v-if="has.parentOrga">
              <h2>Verknüpfung</h2>
              <div class="inputField__spacing">
                <label>Übergeordnete Orga</label>
                <select class="browser-default" v-model="item.parent_orga" v-if="orgas.length">
                  <option :value="null">Keine übergeordnete Orga</option>
                  <option :value="orga" v-for="orga in orgas">{{ orga.title }}</option>
                </select>
              </div>
            </div>

            <h2>Kategorien</h2>
            <div class="inputField__spacing">
              <label for="category">Kategorie (Pflichtfeld)</label>
              <select v-model="item.category" id="category" @change="categoryChanged"
                data-vv-name="category" data-vv-validate-on="change" v-validate="'required'"
                :class="['browser-default', 'categoriesForm', {'validation-error': errors.has('category') }]">
                <option selected :value="null">Keine Kategorie ausgewählt</option>
                <option selected :value="category" v-for="category in categories">{{category.title}}</option>
              </select>
              <span v-show="errors.has('category')" class="validation-error">{{ errors.first('category') }}</span>
            </div>

            <div class="inputField__spacing inputField__indented" v-if="item.category">
              <label>Unterkategorie</label>
              <select class="browser-default categoriesForm" v-model="item.sub_category">
                <option selected :value="null">Keine Kategorie ausgewählt</option>
                <option selected :value="category" v-for="category in item.category.sub_categories">{{category.title}}</option>
              </select>
            </div>

            <h2>{{ $t('headlines.contact') }}</h2>
            <div class="inputField__spacing" v-if="item.contact">
              <div class="input-field">
                <label for="mail" :class="{active: item.contact.mail}">E-Mail</label>
                <input v-model="item.contact.mail" id="mail" type="email"
                  data-vv-name="email" data-vv-validate-on="blur" v-validate="'required|email'"
                  :class="{'validation-error': errors.has('email') }"/>
                <span v-show="errors.has('email')" class="validation-error">{{ errors.first('email') }}</span>
              </div>

              <div class="input-field">
                <label for="phone" :class="{active: item.contact.phone}">Telefon</label>
                <input v-model="item.contact.phone" id="phone" type="text" />
              </div>

              <div class="input-field">
                <label for="contactPerson" :class="{active: item.contact.person}">Kontaktperson</label>
                <input v-model="item.contact.person" id="contactPerson" type="text"
                  data-vv-name="contactPerson" v-validate="'required'"
                  :class="{'validation-error': errors.has('contactPerson') }"/>
                <span v-show="errors.has('contactPerson')" class="validation-error">{{ errors.first('contactPerson') }}</span>
              </div>
            </div>

            <h2>{{ $t('headlines.location') }}</h2>
            <div class="inputField__spacing" v-if="item.location">
              <div class="input-field">
                <label for="placename" :class="{active: item.location.placename}">Ortsbezeichnung</label>
                <input v-model="item.location.placename" id="placename" type="text" class="validate" />
              </div>

              <div class="input-field">
                <label for="street" :class="{active: item.location.street}">Straße</label>
                <input v-model="item.location.street" id="street" type="text" class="validate" />
              </div>

              <div class="input-field">
                <label for="number" :class="{active: item.location.number}">Hausnummer</label>
                <input v-model="item.location.number" id="number" type="text" class="validate" />
              </div>

              <div class="input-field">
                <label for="city" :class="{active: item.location.city}">Stadt</label>
                <input v-model="item.location.city" id="city" type="text" class="validate" />
              </div>
            </div>

            <h2>{{ $tc('headlines.annotations', 2) }}</h2>
            <div class="annotationArea">
              <p class="annotationTag"
                title="Durch das Bearbeiten des Eintrags können Anmerkungen entfernt und hinzugefügt werden."
                v-for="annotation in item.annotations">
                {{ annotation.title }}
                <a href="" @click.prevent="removeAnnotation(annotation)" class="annotationTag__icon">
                  <i class="material-icons">close</i>
                </a>
              </p>
              <p v-if="!item.annotations.length" class="annotationArea__error">Keine Anmerkungen</p>
              <div class="annotationNew">
                <select class="browser-default annotationNew" v-model="selectedAnnotation" @change="addAnnotation">
                  <option :value="null" selected>Neue Anmerkung hinzufügen</option>
                  <option :value="annotation" v-for="annotation in selectableAnnotations">{{ annotation.title }}</option>
                </select>
              </div>
            </div>

            <section class="entryForm__actionFooter">
              <button class="btn waves-effect waves-light" type="submit">Speichern</button>
              <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="has.delete"><i class="material-icons left">delete</i>Löschen</button>
            </section>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import Vue from 'vue'
import autosize from 'autosize'
import Orgas from '@/resources/Orgas'
import Categories from '@/resources/Categories'
import Annotations from '@/resources/Annotations'
import sortByTitle from '@/helpers/sort-by-title'
import DatePicker from '@/components/DatePicker'
import EventBus from '@/services/event-bus'

export default {
  props: ['id', 'routeName', 'Resource', 'messages', 'options'],

  data () {
    const options = this.options || {}
    return {
      origItem: null,
      item: null,
      categories: [],
      annotations: [],
      selectedAnnotation: null,
      orgas: [],
      saved: false,
      has: {
        date: options.hasDate,
        parentOrga: options.hasParentOrga,
        orga: options.hasOrga,
        delete: options.hasDelete
      }
    }
  },

  created () {
    this.Resource.get(this.id).then(entry => {
      if (entry) {
        this.origItem = entry
        this.item = this.Resource.clone(entry)

        Vue.nextTick(() => {
          autosize(this.$el.querySelector('#description'))
        })
      }
    })

    Categories.getAll().then(categories => {
      this.categories = categories.filter(
        category => category.parent_category === null
      )
    })

    Annotations.getAll().then(annotations => {
      this.annotations = annotations
    })

    Orgas.getAll().then(orgas => {
      this.orgas = sortByTitle(orgas)
    })

    EventBus.$on('beforeRouteLeave', this.beforeRouteLeave)
  },

  destroyed () {
    EventBus.$off('beforeRouteLeave', this.beforeRouteLeave)
  },

  computed: {
    selectableAnnotations () {
      return this.annotations.filter(
        annotation => this.item.annotations.includes(annotation) === false
      )
    }
  },

  methods: {
    categoryChanged () {
      this.item.sub_category = null
    },

    addAnnotation () {
      const annotation = this.selectedAnnotation
      if (!this.item.annotations.includes(annotation)) {
        this.item.annotations.push(annotation)
      }
      this.selectedAnnotation = null
    },

    removeAnnotation (annotation) {
      const index = this.item.annotations.indexOf(annotation)
      if (index !== -1) {
        this.item.annotations.splice(index, 1)
      }
    },

    cancel () {
      if (this.item.id) {
        this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}})
      } else {
        this.$router.push({name: this.routeName + '.list'})
      }
    },

    updateDatePickerValues (startDateObject, endDateObject, hasStartTime, hasEndTime) {
      this.item.date_start = startDateObject
      this.item.date_end = endDateObject
      this.item.has_time_start = hasStartTime
      this.item.has_time_end = hasEndTime
    },

    save () {
      this.$validator.validateAll().then(() => {
        this.Resource.save(this.item).then(entry => {
          if (entry) {
            this.$store.dispatch('messages/showAlert', {
              description: this.messages.saved()
            })
            this.saved = true
            this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}})
          }
        })
      }).catch(() => {
        const errors = this.$validator.getErrors().errors
        let errorString = '\n\n'
        for (let error of errors) {
          errorString += error.msg + '\n'
        }
        this.$store.dispatch('messages/showAlert', {
          isError: true,
          autoHide: false,
          description: 'Es sind leider noch Fehler im Formular!' + errorString
        })
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.deleteHeadline(),
        message: this.messages.delete(this.item)
      }).then(result => {
        if (result === 'yes') {
          this.Resource.delete(this.item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.deleted()
              })
              this.saved = true
              this.$router.push({name: this.routeName + '.list'})
            }
          })
        }
      })
    },

    beforeRouteLeave ({to, from, next}) {
      if (this.saved) {
        next()
        return
      }

      // goto login form after api/logout click
      if (to.name === 'login') {
        next()
        return
      }

      const hashItem = JSON.stringify(this.item.serialize())
      const hashOrig = JSON.stringify(this.origItem.serialize())

      if (hashOrig === hashItem) {
        next()
        return
      }

      this.$store.dispatch('messages/showDialog', {
        title: 'Abbrechen?',
        message: 'Soll das Editieren beendet werden?'
      }).then(result => {
        if (result === 'yes') {
          next()
        }
      })
    }
  },

  components: {
    DatePicker
  }
}
</script>


<style lang="scss" scoped>
select.validation-error, textarea.validation-error, input.validation-error {
  margin-top: 2px;
  background-color: #ffeeee;
  border-bottom-color: red;
  box-shadow: 0 1px 0 0 red;
  &:focus {
    background-color: #ffeeee;
    border-bottom-color: red;
    box-shadow: 0 1px 0 0 red;
  }
}

span.validation-error {
  display: block;
  margin-top: -16px;
  margin-bottom: 2em;
  color: #cc6666;
  font-size: .9em;
}

select + span.validation-error {
  margin-top: .4em;
}
</style>
