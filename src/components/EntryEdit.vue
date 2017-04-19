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

        <image-container v-if="item" v-show="!imageError"
          :image-url="item.media_url"
          @state="updateImageContainerState">
        </image-container>

        <div v-if="item">
          <form @submit.prevent="save" class="entryForm" novalidate>

            <div class="inputField__spacing input-field">
              <label for="title" :class="{active: item.title}">Titel <span class="mandatory-field">({{ $t('infos.mandatory_field') }})</span></label>
              <input v-model="item.title" id="title" type="text"
                data-vv-name="title" v-validate="'required'"
                :class="{'validation-error': errors.has('title') }"/>
              <span v-show="errors.has('title')" class="validation-error">{{ errors.first('title') }}</span>
            </div>

            <div class="inputField__spacing input-field">
              <label for="url" :class="{active: item.media_url}"> Bildadresse </label>
              <input id="url" v-model="item.media_url"
              :class="{'validation-error': imageError}"/>
              <span v-if="imageError" class="validation-error">Fehlerhafte Adresse</span>
            </div>

            <div class="inputField__spacing input-field">
              <label for="description" :class="{active: item.description}">Beschreibung <span class="mandatory-field">({{ $t('infos.mandatory_field') }})</span></label>
              <textarea v-model="item.description" id="description"
                data-vv-name="description" v-validate="'required'"
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
              <date-picker
                :date-start="item.date_start"
                :date-end="item.date_end"
                :has-time-start="item.has_time_start"
                :has-time-end="item.has_time_end"
                @input="updateDatePickerValues"
                data-vv-name="date" v-validate="'date-end-not-before-start|date-end-not-start'"
                :class="['inputField__spacing', {'validation-error': errors.has('date') }]"></textarea>
                >
              </date-picker>
              <span v-show="errors.has('date')" class="validation-error">{{ errors.first('date') }}</span>
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
              <label for="category">Kategorie <span class="mandatory-field">({{ $t('infos.mandatory_field') }})</span></label>
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
                  data-vv-name="email" data-vv-validate-on="blur" v-validate="'email'"
                  :class="{'validation-error': errors.has('email') }"/>
                <span v-show="errors.has('email')" class="validation-error">{{ errors.first('email') }}</span>
              </div>

              <div class="input-field">
                <label for="phone" :class="{active: item.contact.phone}">Telefon</label>
                <input v-model="item.contact.phone" id="phone" type="text" />
              </div>

              <div class="input-field">
                <label for="contactPerson" :class="{active: item.contact.person}">Kontaktperson</label>
                <input v-model="item.contact.person" id="contactPerson" type="text"/>
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
                <input v-model="item.location.street" id="street" type="text" class="validate" @change="getGeocode(true)" />
              </div>

              <div class="input-field">
                <label for="zip" :class="{active: item.location.zip}">Postleitzahl</label>
                <input v-model="item.location.zip" id="number" type="text" class="validate" @change="getGeocode(true)" />
              </div>

              <div class="input-field">
                <label for="city" :class="{active: item.location.city}">Stadt</label>
                <input v-model="item.location.city" id="city" type="text" class="validate" @change="getGeocode(true)" />
              </div>

              <div class="input-field">
                <div v-if="geodataLoading">
                  <spinner :show="true" :width="1" :radius="5" :length="3" /> Lade Geodaten
                </div>
                <span v-else-if="geocodeError" class="geodata-not-found validation-error">
                  {{ geocodeError }}
                </span>
                <span v-if="bippelMoved" class="validation-hint">
                  <i class="material-icons">error_outline</i>
                  Der Bippel wurde manuell verschoben und zeigt nicht mehr genau auf die Adresse.<br />
                  Falls das nicht beabsichtigt ist: <a href="" @click.prevent="resetToGeodateOfAddress">Zurücksetzen auf Adresse.</a>
                </span>
              </div>

              <location-map :map-center="mapCenter" :location="item.location" :draggable="true" @bibbelDrag="bibbelDrag"></location-map>
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
              <button class="btn waves-effect waves-light" type="submit">
                <i class="material-icons left">done</i>
                Speichern
              </button>
              <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="has.delete">
                <i class="material-icons left">delete</i>
                Löschen
              </button>
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
import { BASE } from '@/store/api'
import Orgas from '@/resources/Orgas'
import Categories from '@/resources/Categories'
import Annotations from '@/resources/Annotations'
import sortByTitle from '@/helpers/sort-by-title'
import DatePicker from '@/components/DatePicker'
import EventBus from '@/services/event-bus'
import Spinner from '@/components/Spinner'
import LocationMap from '@/components/Map'
import ImageContainer from '@/components/ImageContainer'


export default {
  props: ['id', 'routeName', 'Resource', 'messages', 'options'],

  data () {
    const options = this.options || {}
    return {
      origItem: null,
      item: null,
      categories: [],
      annotations: [],
      orgas: [],
      imageError: false,

      selectedAnnotation: null,

      saved: false,

      geodataLoading: false,
      geodataOfAddress: null,
      geocodeError: false,

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

  watch: {
    'item.location' (location) {
      if (location) {
        if (!location.isEmpty()) {
          this.getGeocode(false)
        }
      }
    },
    'item.media_url' (url) {
      if (url === '') {
        this.imageError = false
      }
    }
  },

  computed: {
    selectableAnnotations () {
      return this.annotations.filter(
        annotation => this.item.annotations.includes(annotation) === false
      )
    },

    bippelMoved () {
      if (!this.item.location || !this.geodataOfAddress) {
        return false
      }
      return this.item.location.lat !== this.geodataOfAddress.lat ||
        this.item.location.lon !== this.geodataOfAddress.lon
    },

    mapCenter () {
      if (this.item.location && this.item.location.lat) {
        return [this.item.location.lat, this.item.location.lon]
      } else {
        return [51.0571904, 13.7154319]
      }
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

    updateDatePickerValues ({dateStart, dateEnd, hasTimeStart, hasTimeEnd}) {
      this.item.date_start = dateStart
      this.item.date_end = dateEnd
      this.item.has_time_start = hasTimeStart
      this.item.has_time_end = hasTimeEnd
    },

    updateImageContainerState ({mediaImageError}) {
      this.imageError = mediaImageError
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

      const hashOrig = JSON.stringify(this.origItem.serialize())
      const hashItem = JSON.stringify(this.item.serialize())

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
    },

    bibbelDrag (markerEvent) {
      this.item.location.lat = '' + markerEvent.target._latlng.lat
      this.item.location.lon = '' + markerEvent.target._latlng.lng
    },

    resetToGeodateOfAddress () {
      this.item.location.lat = this.geodataOfAddress.lat
      this.item.location.lon = this.geodataOfAddress.lon
    },

    getGeocode (updateItemLocation) {
      const address = [this.item.location.zip || '', this.item.location.city || '', this.item.location.street || ''].join(' ')
      if (address === '  ') {
        this.geocodeError = false
        this.item.location.lat = null
        this.item.location.lon = null
        this.geodataOfAddress = null
        return
      }

      this.geodataLoading = true

      let url = BASE + 'geocoding'
      setTimeout(() => {
        let request = Vue.http.get(url, {params: {token: 'MapCat_050615', address}})
        request.then(result => {
          this.geocodeError = false
          this.geodataOfAddress = {
            lat: '' + result.body.latitude,
            lon: '' + result.body.longitude
          }
          if (updateItemLocation) {
            this.item.location.lat = '' + result.body.latitude
            this.item.location.lon = '' + result.body.longitude
          }
        }).catch(error => {
          this.item.location.lat = null
          this.item.location.lon = null
          this.geodataOfAddress = null
          this.geocodeError = 'Geodaten nicht gefunden. Bitte Adresse anpassen.'
          console.log('error loading geodata', error)
        }).finally(() => {
          this.geodataLoading = false
        })
      }, 200)
    }
  },

  components: {
    DatePicker,
    Spinner,
    LocationMap,
    ImageContainer
  }
}
</script>


<style lang="scss" scoped>
select.validation-error, textarea.validation-error, input.validation-error, div.validation-error {
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

.datePicker.validation-error {
  background-color: #ffeeee;
}

span.validation-error {
  display: block;
  margin-top: -16px;
  margin-bottom: 2em;
  color: #cc6666;
  font-size: .9em;

  &.geodata-not-found {
    margin-bottom: 0;
  }
}

span.validation-hint {
  font-size: .9em;
  color: #999;
  i {
    vertical-align: middle;
    font-size: 1.4em;
  }
}

select + span.validation-error, .datePicker + span.validation-error {
  margin-top: .4em;
}
</style>
