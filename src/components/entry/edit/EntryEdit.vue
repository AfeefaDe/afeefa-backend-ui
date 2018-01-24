<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div v-bind:class="['mainCard__header', 'mainCard__headerCategories', categoryClass]" v-if="item">
          <div class="mainCard__headerTitle">
            <h2 class="mainCard__headerTitle"> {{item.title || 'Kein Titel'}}</h2>
            <span v-if="item.parent_orga" class="mainCard__headerSubtitle">
              <router-link :to="{name: item.parent_orga.type + '.show', params: {id: item.parent_orga.id}}">
                <u> {{ item.parent_orga.title }}</u>
              </router-link>
            </span>
          </div>
          <a href="" @click.prevent="cancel" class="mainCard__headerAction"><i class="material-icons">cancel</i></a>
        </div>

        <image-container v-if="item" v-show="!imageError"
          :image-url="item.media_url"
          @state="updateImageContainerState">
        </image-container>

        <div v-if="item">
          <form @submit.prevent="save" class="entryForm" novalidate>

            <tab-bar v-on:setCurrentTab="setCurrentTab" :tabNames="tabNames">
              <section slot="generalTab">
                <div class="inputField__spacing" v-if="item.type === 'orgas'">
                  <label for="orgaType">Typ</label>
                  <select v-model="item.orga_type_id" id="orgaType"
                   name="orgaType"
                    :class="['browser-default']">
                    <option :value="orgaType.id" v-for="orgaType in orgaTypes" :key="orgaType.id">{{ orgaType.name }}</option>
                  </select>
                </div>

                <div v-if="item.type === 'orgas' && item.id">
                  <h2>Projektträger</h2>

                  <project-initiator-selector :actor="item">
                  </project-initiator-selector>

                  <h2>Netzwerke</h2>

                  <network-selector :actor="item">
                  </network-selector>

                  <h2>Partner</h2>

                  <partner-selector :actor="item">
                  </partner-selector>
                </div>

                <div v-if="item.type === 'events'">
                  <label>{{ $t('headlines.organizer')}}</label>

                  <power-selector
                    :items="orgas"
                    :selected-items="parentOrgas"
                    :search-fields="['title']"
                    @select="parentOrgaChanged"
                    @remove="parentOrgaRemoved"
                    :messages="{
                      addButtonTitle: 'Veranstalter hinzufügen',
                      removeTitle: 'Veranstalter entfernen?',
                      removeMessage: actor => {
                        return `Soll der Veranstalter entfernt werden?`
                      }
                    }">
                    <div slot="selected-item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                    <div slot="item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                  </power-selector>
                </div>

                <h2>Kategorien</h2>

                <category-selector :item="item">
                </category-selector>

                <br>

                <input-field
                  class="inputField__spacing"
                  field-name="title"
                  v-model="item.title"
                  validate="required|max:150"
                  :label="$t('entries.title')"
                  :options="{charCount: true}">
                </input-field>

                <div class="inputField__spacing input-field">
                  <label for="url" :class="{active: item.media_url}">{{ $t('entries.image_link') }}</label>
                  <input id="url" v-model="item.media_url"
                    :class="{'validation-error': imageError}"/>
                  <span v-if="imageError" class="validation-error">Die Bild-URL ist fehlerhaft.</span>
                </div>

                <label for="short_description" :class="{active: item.short_description}">
                  {{ $t('entries.short_description') }}
                  <span class="labelCharacterCount" v-if="item.short_description.length">{{item.short_description.length}}/350</span>
                </label>

                <div class="inputField__spacing input-field">
                  <p v-if="item.parent_orga && item.inheritance.short_description" class="inheritance-output">
                    {{item.parent_orga.short_description}}
                  </p>
                  <textarea
                    v-model="item.short_description"
                    id="short_description"
                    name="short_description"
                    :data-vv-as="$t('entries.short_description')"
                    v-validate.initial="'required|max: 350'"
                    :class="['materialize-textarea', {'validation-error': errors.has('short_description') }]"
                    v-autosize>
                  </textarea>
                  <span v-show="errors.has('short_description')" class="validation-error">{{ errors.first('short_description') }}</span>
                </div>

                <div class="inheritance-field input-field" v-if="item.parent_orga && item.parent_orga.short_description">
                  <input class="filled-in" id="inheritDescription" type="checkbox" v-model="item.inheritance.short_description"/>
                  <label for="inheritDescription">{{ $t('checkboxes.short_description_inheritance') }}</label>
                </div>

                <div class="inputField__spacing input-field">
                  <label for="description" :class="{active: item.description}">{{ $t('entries.description') }}</label>
                  <textarea v-model="item.description" id="description"
                    class="materialize-textarea" v-autosize></textarea>
                </div>
                <br>

                <div class="inputField__spacing input-field" v-if="currentUser && currentUser.area=='dresden'">
                  <h2>{{ $tc("entries.tags", 2) }}</h2>
                  <div class="input-field">
                    <tags-select-input @input="tagsChanged" :entryValue='item.tags'></tags-select-input>
                  </div>
                  <span class="validation-hint">
                    <i class="material-icons">error_outline</i>
                    Tags können mehrere Orgas und Veranstaltungen gruppieren.
                  </span>
                </div>

                <div class="input-field">
                  <h2>{{ $t("headlines.support_wanted") }}</h2>
                  <input type="checkbox" id="support_wanted" class="filled-in" v-model="item.support_wanted"/>
                  <label for="support_wanted">{{$t("entries.support_wanted_yes")}}</label>
                </div>
                <div class="input-field" v-if="item.support_wanted">
                  <textarea
                    id="supportWantedDetail"
                    name="support_wanted_detail"
                    v-model="item.support_wanted_detail"
                    :data-vv-as="$t('entries.support_wanted_detail')"
                    v-validate.initial="'max: 350'"
                    v-bind:class="[{'validation-error': errors.has('support_wanted_detail')}, 'materialize-textarea']"
                    v-autosize>
                  </textarea>
                  <label for="supportWantedDetail" :class="{active: item.support_wanted_detail}">
                    {{$t("entries.support_wanted_detail")}}
                    <span class="labelCharacterCount" v-if="item.support_wanted_detail">{{item.support_wanted_detail.length}}/350</span>
                  </label>
                  <span v-show="errors.has('support_wanted_detail')" class="validation-error">{{ errors.first('support_wanted_detail') }}</span>
                </div>

                <!-- this v-if condition is a hotfix for #339 and should be implemented in the api as well -->
                <div class="input-field" v-if="currentUser && currentUser.area=='dresden'">
                  <h2>{{ $t("headlines.certified_sfr") }}</h2>
                  <input type="checkbox" id="certified_sfr" class="filled-in" v-model="item.certified_sfr"/>
                  <label for="certified_sfr">{{$t("entries.certified_sfr_yes")}}</label>
                </div>

                <div v-if="has.date">
                  <h2>{{ $t("headlines.time") }}</h2>
                  <date-picker
                    :date-start="item.date_start"
                    :date-end="item.date_end"
                    :has-time-start="item.has_time_start"
                    :has-time-end="item.has_time_end"
                    @input="updateDatePickerValues"
                    name="date" v-validate="'date-end-not-earlier-than-start|date-end-not-start'"
                    :class="['inputField__spacing', {'validation-error': errors.has('date') }]"
                    >
                  </date-picker>
                  <span v-show="errors.has('date')" class="validation-error">{{ errors.first('date') }}</span>
                </div>

                <div v-if="item.type === 'orgas'">
                  <input-field
                    field-name="facebook_id"
                    v-model="item.facebook_id"
                    validate="min:15|max:64"
                    label="Facebook ID für Events">
                  </input-field>
                </div>
              </section>

              <section slot="annotationsTab">
                <annotation-form :item="item">
                </annotation-form>
              </section>

              <section slot="placeTab">
                <location-form
                  :location="item.location"
                  :currentTab="currentTab"
                  v-if="item.location">
                </location-form>
              </section>

              <section slot="contactTab">
                <edit-contact-info ref="EditContactInfo" v-if="item.contact"
                  :contact-info="item.contact"
                  :inheritance-state="item.inheritance.contact_infos"
                  :type="item.type"
                  :parent-orga="item.parent_orga"
                  @input="updateInheritedContactInfo">
                </edit-contact-info>
              </section>

              <section slot="networkMembersTab">
                <network-member-selector :actor="this.item">
                </network-member-selector>
              </section>

              <section slot="projectsTab">
                <project-selector :actor="this.item">
                </project-selector>
              </section>

              <section slot="resourceTab" v-if="item.type === 'orgas'">
                <resource-form :item="item">
                </resource-form>
              </section>
            </tab-bar>

            <br>
            <section class="entryForm__actionFooter">
              <button class="btn waves-effect waves-light saveButton" type="submit">
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
            <span v-if="loadingError">{{ messages.loadingItemError() }} ...</span>
            <span v-else>{{ messages.loadingItem() }} ...</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import Multiselect from 'vue-multiselect'
import Orgas from '@/resources/Orgas'
import Users from '@/resources/Users'
import OrgaType from '@/models/OrgaType'
import sortByTitle from '@/helpers/sort-by-title'
import ImageContainer from '@/components/ImageContainer'
import TabBar from '@/components/TabBar'
import PowerSelector from '@/components/PowerSelector'
import InputField from '@/components/InputField'

import LocationForm from './LocationForm'
import DatePicker from './datepicker/DatePicker'
import EditContactInfo from './EditContactInfo'
import TagsSelectInput from './TagsSelectInput'
import CategorySelector from './CategorySelector'
import AnnotationForm from './AnnotationForm'
import ResourceForm from './ResourceForm'

import ProjectInitiatorSelector from './actor-relations/ProjectInitiatorSelector'
import NetworkSelector from './actor-relations/NetworkSelector'
import PartnerSelector from './actor-relations/PartnerSelector'
import ProjectSelector from './actor-relations/ProjectSelector'
import NetworkMemberSelector from './actor-relations/NetworkMemberSelector'

import ValidationMixin from '@/components/mixins/ValidationMixin'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  mixins: [ValidationMixin, RouteConfigAwareMixin],

  props: ['id', 'options'],

  data () {
    const options = this.options || {}

    return {
      origItem: null,
      item: null,
      orgas: [],
      parentOrgas: [],
      currentUser: null,

      imageError: false,
      loadingError: false,

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

        Orgas.getAll().then(orgas => {
          this.orgas = sortByTitle(orgas)
        })

        this.currentUser = Users.getCurrentUser()
      } else {
        console.log('error loading item')
        this.loadingError = true
      }
    })
  },

  watch: {
    'item.media_url' (url) {
      if (url === '') {
        this.imageError = false
      }
    },

    'item.parent_orga' (orga) {
      this.parentOrgas = orga ? [orga] : []
    }
  },

  computed: {
    orgaTypes () {
      return OrgaType.TYPES
    },

    categoryClass () {
      if (this.item.category && this.item.category.title) {
        return 'cat-' + this.item.category.title
      }
    },

    /*
     * define tabNames according to the entry type and the area of the current user
     */
    tabNames () {
      let tabNames = ['generalTab', 'annotationsTab', 'placeTab', 'contactTab']
      if (this.item.type === 'orgas' && this.currentUser.area === 'dresden') {
        tabNames.push('resourceTab')
      }
      if (this.item.type === 'orgas') {
        if (this.item.network_members.length) {
          tabNames.push('networkMembersTab')
        }
        tabNames.push('projectsTab')
      }
      return tabNames
    }
  },

  methods: {
    parentOrgaChanged (parentOrga) {
      this.item.parent_orga = parentOrga
      Orgas.get(parentOrga.id, ['fetchContact']).then(orga => {
        this.item.parent_orga = orga
        this.parentOrgas = [orga]
      })
    },

    parentOrgaRemoved () {
      this.item.parent_orga = null
      this.parentOrgas = []
    },

    /*
     * called by TagsSelectInput
     * sets the comma-sparated list on the tag attribute
     */
    tagsChanged (newTags) {
      this.item.tags = newTags
    },

    setCurrentTab (newCurrentTab) {
      this.currentTab = newCurrentTab
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

    updateInheritedContactInfo (inheritanceState) {
      this.item.inheritance.contact_infos = inheritanceState
    },

    updateImageContainerState ({mediaImageError}) {
      this.imageError = mediaImageError
    },

    save () {
      this.$validator.setLocale(this.$i18n.locale)
      const contactInfoEditValidation = this.$refs.EditContactInfo.validateForm()
      const entryEditValidation = this.validateForm()

      Promise.all([contactInfoEditValidation, entryEditValidation]).then(validations => {
        let throwError = false
        let errorString = '\n\n'
        // fix for vee-validator async validation bug see below
        if (this.imageError) {
          validations.push([{msg: 'Die Bild-URL ist fehlerhaft.'}])
        }
        // prepare errorString from all validations
        for (let validation of validations) {
          if (validation) {
            throwError = true
            for (let error of validation) {
              errorString += error.msg + '\n'
            }
          }
        }
        // at least one error occured during the validation
        if (throwError) {
          this.$store.dispatch('messages/showAlert', {
            isError: true,
            autoHide: false,
            description: 'Es sind leider noch Fehler im Formular!' + errorString
          })
        } else {
          // fix for vee-validator which is currently not
          // able to deal with async validations:
          // https://github.com/logaretm/vee-validate/issues/356
          // using an async validator for image url, we always would
          // land in this block rather than in 'catch'
          if (this.imageError) {
            throw new Error()
          }
          // actual save routine on the resource
          this.Resource.save(this.item).then(entry => {
            if (entry) {
              this.$store.dispatch('messages/showAlert', {
                description: this.origItem.id ? this.messages.saveItemSuccess() : this.messages.addItemSuccess()
              })
              this.origItem = this.item // prevent route leave dialog after save
              this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}, query: {tab: this.currentTab}})
            }
          })
        }
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.deleteItemDialogTitle(),
        message: this.messages.deleteItemDialogMessage(this.item)
      }).then(result => {
        if (result === 'yes') {
          this.Resource.delete(this.item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.deleteItemSuccess()
              })
              this.origItem = this.item // prevent route leave dialog after save
              this.$router.push({name: this.routeName + '.list'})
            }
          })
        }
      })
    },

    /*
     * called by the BeforeRouteLeaveMixin
     * to raise a alert in case of unsaved changes
     */
    $canLeaveRoute () {
      if (!this.item) { // loading error
        return true
      }
      const hashOrig = JSON.stringify(this.origItem.serialize())
      const hashItem = JSON.stringify(this.item.serialize())

      if (hashOrig === hashItem) {
        return true
      }
      return 'Soll das Editieren beendet werden?'
    }
  },

  components: {
    DatePicker,
    ImageContainer,
    TabBar,
    Multiselect,
    EditContactInfo,
    TagsSelectInput,
    InputField,
    PowerSelector,
    LocationForm,
    CategorySelector,
    AnnotationForm,
    ResourceForm,

    ProjectInitiatorSelector,
    NetworkSelector,
    PartnerSelector,
    ProjectSelector,
    NetworkMemberSelector
  }
}
</script>
