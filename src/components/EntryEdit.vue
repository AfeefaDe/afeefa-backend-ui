<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">

        <div class="mainCard__header mainCard__headerGreen" v-if="item">
          <h2 class="mainCard__headerTitle"> {{item.title || 'Kein Titel'}}</h2>
          <a href="" @click.prevent="cancel" class="mainCard__headerAction"><i class="material-icons">cancel</i></a>
        </div>

        <image-container v-if="item" v-show="!imageError"
          :image-url="item.media_url"
          @state="updateImageContainerState">
        </image-container>

        <div v-if="item">
          <form @submit.prevent="save" class="entryForm" novalidate>

            <entry-tabbed-content v-on:setCurrentTab="setCurrentTab">
              <section slot="generalTab">
                <br>
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

                <div class="inputField__spacing input-field">
                  <label for="url" :class="{active: item.media_url}">{{ $t('entries.image_link') }}</label>
                  <input id="url" v-model="item.media_url"
                    :class="{'validation-error': imageError}"/>
                  <span v-if="imageError" class="validation-error">Die Bild-URL ist fehlerhaft.</span>
                </div>

                <div class="inputField__spacing input-field">
                  <label for="short_description" :class="{active: item.short_description}">
                    {{ $t('entries.short_description') }}
                    <span class="labelCharacterCount" v-if="item.short_description.length">{{item.short_description.length}}/350</span>
                  </label>
                  <textarea v-model="item.short_description" id="short_description"
                  name="short_description" :data-vv-as="$t('entries.short_description')" v-validate.initial="'required|max: 350'"
                  :class="['materialize-textarea', {'validation-error': errors.has('short_description') }]"></textarea>
                  <span v-show="errors.has('short_description')" class="validation-error">{{ errors.first('short_description') }}</span>
                </div>

                <div class="inputField__spacing input-field">
                  <label for="description" :class="{active: item.description}">Beschreibung</label>
                  <textarea v-model="item.description" id="description"
                    class="materialize-textarea"></textarea>
                </div>

                <h2>Kategorien</h2>
                <div class="inputField__spacing">
                  <label for="category">Kategorie</label>
                  <select v-model="item.category" id="category" @change="categoryChanged"
                   name="category" data-vv-validate-on="change" :data-vv-as="$t('entries.category')" v-validate.initial="'required'"
                    :class="['browser-default', 'categoriesForm', {'validation-error': errors.has('category') }]">
                    <option selected :value="null">Keine Kategorie ausgewählt</option>
                    <option selected :value="category" v-for="category in categories">{{ $t('categories.' + category.title) }}</option>
                  </select>
                  <span v-show="errors.has('category')" class="validation-error">{{ errors.first('category') }}</span>
                </div>

                <div class="inputField__spacing inputField__indented" v-if="item.category">
                  <label>Unterkategorie</label>
                  <select class="browser-default categoriesForm" v-model="item.sub_category">
                    <option selected :value="null">Keine Kategorie ausgewählt</option>
                    <option selected :value="category" v-for="category in item.category.sub_categories">{{ $t('categories.' + category.title) }}</option>
                  </select>
                </div>

                <div class="input-field">
                  <h2>{{ $t("headlines.for_children") }}</h2>
                  <input type="checkbox" id="for_children" class="filled-in" v-model="item.for_children"/>
                  <label for="for_children">{{$t("entries.for_children_yes")}}</label>
                </div>

                <div class="input-field">
                  <h2>{{ $t("headlines.support_wanted") }}</h2>
                  <input type="checkbox" id="support_wanted" class="filled-in" v-model="item.support_wanted"/>
                  <label for="support_wanted">{{$t("entries.support_wanted_yes")}}</label>
                </div>

                <div v-if="has.date">
                  <h2>{{ $t("headlines.time") }}</h2>
                  <date-picker
                    :date-start="item.date_start"
                    :date-end="item.date_end"
                    :has-time-start="item.has_time_start"
                    :has-time-end="item.has_time_end"
                    @input="updateDatePickerValues"
                    name="date" v-validate="'date-end-not-before-start|date-end-not-start'"
                    :class="['inputField__spacing', {'validation-error': errors.has('date') }]"
                    >
                  </date-picker>
                  <span v-show="errors.has('date')" class="validation-error">{{ errors.first('date') }}</span>
                </div>

                <h2>{{ $tc('headlines.annotations', 2) }}</h2>
                <span v-if="bippelMoved" class="validation-hint">
                  <i class="material-icons">error_outline</i>
                  Annmerkungen sind nicht öffentlich sichtbar und dienen nur den Redakteur*innen.
                </span>
                <div class="annotationEditArea">
                  <annotation-tag v-for="annotation in item.annotations" :annotation="annotation" :editMode="true" v-on:remove="removeAnnotation" :key="annotation.id"></annotation-tag>
                  <p v-if="!item.annotations.length" class="annotationArea__error">Keine Anmerkungen</p>
                  <div class="annotationNew">
                    <select class="browser-default annotationNew" v-model="selectedAnnotation" @change="addAnnotation">
                      <option :value="null" selected>Neue Anmerkung hinzufügen</option>
                      <option :value="annotation" v-for="annotation in selectableAnnotations">{{ annotation.title }}</option>
                    </select>
                  </div>
                </div>
              </section>


              <section slot="placeTab">
                <br>
                <div class="inputField__spacing" v-if="item.location">
                  <div class="input-field">
                    <label for="placename" :class="{active: item.location.placename}">Ortsbezeichnung (z.B. Hinterhof)</label>
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

                  <div class="input-field">
                    <label for="directions" :class="{active: item.location.directions}">
                      {{ $t('entries.directions') }}
                    </label>
                    <textarea v-model="item.location.directions" id="directions"
                      class="materialize-textarea"></textarea>
                  </div>
                </div>
              </section>


              <section slot="contactTab">
                <br>
                <div class="inputField__spacing" v-if="item.contact">
                  <div class="input-field">
                    <label for="mail" :class="{active: item.contact.mail}">E-Mail</label>
                    <input v-model="item.contact.mail" id="mail" type="email"
                      name="email" data-vv-validate-on="blur" v-validate="'email'"
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

                  <div class="inputField__spacing input-field" v-if="item.type === 'orgas'">
                    <label for="openingHours" :class="{active: item.contact.openingHours}">
                      {{ $t('entries.openingHours') }}
                    </label>
                    <textarea v-model="item.contact.openingHours" id="openingHours"
                      class="materialize-textarea"></textarea>
                  </div>

                  <div class="input-field">
                    <label for="web" :class="{active: item.contact.web}">{{ $t('entries.web') }}</label>
                    <input id="web"
                          type="text"
                          v-model="item.contact.web"
                          name="web"
                          data-vv-validate-on="blur"
                          v-validate="'url-with-protocol'"
                          :class="{'validation-error': errors.has('web') }"/>
                    <span v-show="errors.has('web')" class="validation-error">{{ errors.first('web') }}</span>
                  </div>

                  <div class="input-field">
                    <label for="socialMedia" :class="{active: item.contact.socialMedia}">{{ $t('entries.socialMedia') }}</label>
                    <input id="socialMedia"
                          type="text"
                          v-model="item.contact.socialMedia"
                          name="socialMedia"
                          data-vv-validate-on="blur"
                          v-validate="'url-with-protocol'"
                          :class="{'validation-error': errors.has('socialMedia') }"/>
                  </div>
                  <span v-show="errors.has('socialMedia')" class="validation-error">{{ errors.first('socialMedia') }}</span>

                  <lang-select-input  @input="updateSpokenLanguages" :entryValue="item.contact.spokenLanguages"></lang-select-input>

                </div>
              </section>


              <section slot="linkTab">
                <div class="inputField__spacing" v-if="has.orga">
                  <br>
                  <label>Veranstalter</label>
                  <select class="browser-default" v-model="item.parent_orga" v-if="orgas.length">
                    <option :value="null">Kein Veranstalter</option>
                    <option :value="orga" v-for="orga in orgas">{{ orga.title }}</option>
                  </select>
                </div>

                <div v-if="has.parentOrga">
                  <br>
                  <div class="inputField__spacing">
                    <label>Übergeordnete Orga</label>
                    <select class="browser-default" v-model="item.parent_orga" v-if="orgas.length">
                      <option :value="null">Keine übergeordnete Orga</option>
                      <option :value="orga" v-for="orga in orgas">{{ orga.title }}</option>
                    </select>
                  </div>
                </div>
              </section>
            </entry-tabbed-content>

            <br>
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

        <div v-else class="mainCard">
          <div class="mainCard__header mainCard__headerLight">
            <span v-if="loadingError">{{ messages.loadingError() }} ...</span>
            <span v-else>{{ messages.loading() }} ...</span>
          </div>
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
import AnnotationCategories from '@/resources/AnnotationCategories'
import sortByTitle from '@/helpers/sort-by-title'
import DatePicker from '@/components/DatePicker'
import AnnotationTag from '@/components/AnnotationTag'
import EventBus from '@/services/event-bus'
import Spinner from '@/components/Spinner'
import LocationMap from '@/components/Map'
import ImageContainer from '@/components/ImageContainer'
import EntryTabbedContent from '@/components/EntryTabbedContent'
import LangSelectInput from '@/components/LangSelectInput'

export default {
  props: ['id', 'routeName', 'Resource', 'messages', 'options'],

  data () {
    const options = this.options || {}
    return {
      origItem: null,
      item: null,
      categories: [],
      annotationCategories: [],
      orgas: [],

      imageError: false,
      loadingError: false,
      selectedAnnotation: null,
      saved: false,

      geodataLoading: false,
      geodataOfAddress: null,
      geocodeError: false,

      currentTab: '',

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
      } else {
        console.log('error loading item')
        this.loadingError = true
      }
    })

    Categories.getAll().then(categories => {
      this.categories = categories.filter(
        category => category.parent_category === null
      )
    })

    AnnotationCategories.getAll().then(annotationCategories => {
      this.annotationCategories = annotationCategories
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
    'item.contact' (contact) {
      if (contact) {
        this.checkAutosizeFields()
      }
    },
    'item.location' (location) {
      if (location) {
        if (!location.isEmpty()) {
          this.getGeocode(false)
        }
        this.checkAutosizeFields()
      }
    },
    'item.media_url' (url) {
      if (url === '') {
        this.imageError = false
      }
    }
  },

  computed: {
    /*
     * selecteable annotations: hide already used annotaionCategories
     */
    selectableAnnotations () {
      return this.annotationCategories.filter(
        (annotationCategory) => {
          for (let annotation of this.item.annotations) {
            if (annotation.annotationCategory.id === annotationCategory.id) return false
          }
          return true
        }
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

    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab

      this.checkAutosizeFields()
    },

    checkAutosizeFields () {
      Vue.nextTick(() => {
        const description = this.$el.querySelector('#description')
        if (description) {
          autosize(this.$el.querySelector('#description'))
          autosize(this.$el.querySelector('#short_description'))
        }

        const directions = this.$el.querySelector('#directions')
        if (directions) {
          autosize(this.$el.querySelector('#directions'))
        }

        const openingHours = this.$el.querySelector('#openingHours')
        if (openingHours) {
          autosize(this.$el.querySelector('#openingHours'))
        }
      })
    },

    addAnnotation () {
      const annotationCategory = this.selectedAnnotation
      let newAnnotation = Annotations.createItem()
      // the detail attribute is currently reserved for annoations generated by the backend
      newAnnotation.detail = null
      newAnnotation.annotationCategory = annotationCategory
      this.item.annotations.push(newAnnotation)
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
        this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}, query: {tab: this.currentTab}})
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

    updateSpokenLanguages (spokenLanguages) {
      this.item.contact.spokenLanguages = spokenLanguages
    },

    updateImageContainerState ({mediaImageError}) {
      this.imageError = mediaImageError
    },

    save () {
      this.$validator.validateAll().then(result => {
        // fix for vee-validator which is currently not
        // able to deal with async validations:
        // https://github.com/logaretm/vee-validate/issues/356
        // using an async validator for image url, we always would
        // land in this block rather than in 'catch'
        if (this.imageError) {
          throw new Error()
        }
        this.Resource.save(this.item).then(entry => {
          if (entry) {
            this.$store.dispatch('messages/showAlert', {
              description: this.messages.saved()
            })
            this.saved = true
            this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}, query: {tab: this.currentTab}})
          }
        })
      }).catch(() => {
        const errors = this.$validator.getErrors().errors

        // fix for vee-validator async validation bug see above
        if (this.imageError) {
          this.errors.add('imageurl', 'Die Bild-URL ist fehlerhaft.')
        } else {
          this.errors.remove('imageurl')
        }

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

      if (!this.entry) { // loading error
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
    ImageContainer,
    AnnotationTag,
    EntryTabbedContent,
    LangSelectInput
  }
}
</script>


<style lang="scss" scoped>
@import "~variables";

.entryForm {
  h2 {
    margin-top: 2em;
    margin-bottom: 0.5em;
    font-size: 1.4em;
    font-weight: 500;
  }
  &__actionFooter {
    margin-top: 1.2em;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: $break-medium) {
      flex-wrap: wrap;
      button {
        flex-grow: 2;
        margin-bottom: 1.5em;
      }
    }
  }
  .mandatory-field {
    color: #26a69a;
  }
}
.input-field {
  .flatpickr-input {
    color: inherit !important;
  }
  label {
    display: inline-block;
    width: 100%;
  }
  .labelCharacterCount {
    float: right;
  }
}

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

.annotationEditArea {
  background: $white;
  padding: 0.5em;
  border-radius: 5px;
  margin-top: 0.5em;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  &__error {
    color: $gray50;
    margin-left: 0.3em;
  }
  .annotationNew {
    display: block;
    width: 100%;
    margin-top: 0.4em;
  }
}

</style>
