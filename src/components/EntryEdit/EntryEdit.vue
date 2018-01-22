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

            <entry-tabbed-content v-on:setCurrentTab="setCurrentTab" :tabNames="tabNames">
              <section slot="generalTab">
                <br>

                <div class="inputField__spacing" v-if="item.type === 'orgas'">
                  <label for="orgaType">Typ</label>
                  <select v-model="item.orga_type_id" id="orgaType"
                   name="orgaType"
                    :class="['browser-default', 'categoriesForm']">
                    <option :value="orgaType.id" v-for="orgaType in orgaTypes" :key="orgaType.id">{{ orgaType.name }}</option>
                  </select>
                </div>

                <div v-if="item.type === 'orgas' && item.id">
                  <h2>Projektträger</h2>

                  <power-selector
                    :items="orgas"
                    :selected-items="item.project_initiators"
                    :search-fields="['title']"
                    @select="addProjectInitiator"
                    @remove="removeProjectIntiator"
                    :messages="{
                      addButtonTitle: 'Projektträger hinzufügen',
                      removeTitle: 'Projektträger entfernen?',
                      removeMessage (item) {
                        return `Soll die Orga ${item.title} kein Projektträger mehr sein?`
                      }
                    }"
                    v-if="orgas.length">
                    <div slot="selected-item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                    <div slot="item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                  </power-selector>

                  <h2>Netzwerke</h2>

                  <power-selector
                    :items="orgas"
                    :selected-items="item.networks"
                    :search-fields="['title']"
                    @select="joinNetwork"
                    @remove="leaveNetwork"
                    :messages="{
                      addButtonTitle: 'Netzwerk hinzufügen',
                      removeTitle: 'Netzwerk verlassen?',
                      removeMessage (item) {
                        return `Soll das Netzwerk ${item.title} verlassen werden?`
                      }
                    }"
                    v-if="orgas.length">
                    <div slot="selected-item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                    <div slot="item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                  </power-selector>

                  <h2>Partner</h2>

                  <power-selector
                    :items="orgas"
                    :selected-items="item.partners"
                    :search-fields="['title']"
                    @select="addPartner"
                    @remove="removePartner"
                    :messages="{
                      addButtonTitle: 'Partner hinzufügen',
                      removeTitle: 'Partner entfernen?',
                      removeMessage (item) {
                        return `Soll die Orga ${item.title} kein Partner mehr sein?`
                      }
                    }"
                    v-if="orgas.length">
                    <div slot="selected-item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                    <div slot="item" slot-scope="props">
                      <div>{{ props.item.title }}</div>
                    </div>
                  </power-selector>
                </div>

                <div
                  v-if="item.type === 'events'"
                  v-bind:class="[
                    {'customMultiselect--hide': parentOrgaSimplified.length===1},
                    'inputField__spacing',
                    'customMultiselect'
                  ]">

                  <label>{{ $t('headlines.organizer')}}</label>
                  <multiselect
                    v-model="parentOrgaSimplified"
                    :options="orgasSimplified"
                    label="title"
                    track-by="id"

                    :multiple="true"
                    :max="1"
                    :searchable="true"
                    :allow-empty="true"
                    @input="parentOrgaChanged"

                    :placeholder="$t('multiselect.noSelection')"
                    :selectLabel="$t('multiselect.selectLabel')"
                    :selectedLabel="$t('multiselect.selectedLabel')"
                    :deselectLabel="$t('multiselect.deselectLabel')"
                  >
                  </multiselect>
                </div>

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

                <label for="short_description" :class="{active: item.short_description}">
                  {{ $t('entries.short_description') }}
                  <span class="labelCharacterCount" v-if="item.short_description.length">{{item.short_description.length}}/350</span>
                </label>
                <div class="inputField__spacing input-field">
                  <p v-if="item.parent_orga && item.inheritance.short_description" class="inheritance-output">
                    {{item.parent_orga.short_description}}
                  </p>
                  <textarea v-model="item.short_description" id="short_description"
                  name="short_description" :data-vv-as="$t('entries.short_description')" v-validate.initial="'required|max: 350'"
                  :class="['materialize-textarea', {'validation-error': errors.has('short_description') }]"></textarea>
                  <span v-show="errors.has('short_description')" class="validation-error">{{ errors.first('short_description') }}</span>
                </div>

                <div class="inheritance-field input-field" v-if="item.parent_orga && item.parent_orga.short_description">
                  <input class="filled-in" id="inheritDescription" type="checkbox" v-model="item.inheritance.short_description"/>
                  <label for="inheritDescription">{{ $t('checkboxes.short_description_inheritance') }}</label>
                </div>


                <div class="inputField__spacing input-field">
                  <label for="description" :class="{active: item.description}">{{ $t('entries.description') }}</label>
                  <textarea v-model="item.description" id="description"
                    class="materialize-textarea"></textarea>
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

                <h2>Kategorien</h2>
                <div class="inputField__spacing">
                  <label for="category">Kategorie</label>
                  <select v-model="item.category" id="category" @change="categoryChanged"
                   name="category" data-vv-validate-on="change" :data-vv-as="$t('entries.category')" v-validate.initial="'required'"
                    :class="['browser-default', 'categoriesForm', {'validation-error': errors.has('category') }]">
                    <option selected :value="null">Keine Kategorie ausgewählt</option>
                    <option selected :value="category" v-for="category in categories" :key="category.id">{{ $t('categories.' + category.title) }}</option>
                  </select>
                  <span v-show="errors.has('category')" class="validation-error">{{ errors.first('category') }}</span>
                </div>

                <div class="inputField__spacing inputField__indented" v-if="item.category && item.category.sub_categories && item.category.sub_categories.length">
                  <label>Unterkategorie</label>
                  <select class="browser-default categoriesForm" v-model="item.sub_category">
                    <option selected :value="null">Keine Kategorie ausgewählt</option>
                    <option selected :value="category" v-for="category in item.category.sub_categories" :key="category.id">{{ $t('categories.' + category.title) }}</option>
                  </select>
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
                    v-bind:class="[{'validation-error': errors.has('support_wanted_detail')}, 'materialize-textarea']"></textarea>
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
                    validation="min:15|max:64"
                    label="Facebook ID für Events">
                  </input-field>
                </div>

                <h2>{{ $tc('headlines.annotations', 2) }}</h2>
                <div class="annotationEditArea">
                  <annotation-tag
                    v-for="annotation in item.annotations"
                    :annotation="annotation"
                    :editMode="true"
                    v-on:remove="removeAnnotation"
                    :key="annotation.id">
                  </annotation-tag>
                  <p v-if="!item.annotations.length" class="annotationArea__error">Keine Anmerkungen</p>
                  <div class="annotationNew">
                    <select class="browser-default annotationNew" v-model="selectedAnnotation" @change="addAnnotation">
                      <option :value="null" selected>Neue Anmerkung hinzufügen</option>
                      <option :value="annotation" v-for="annotation in selectableAnnotations" :key="annotation.id">{{ annotation.title }}</option>
                    </select>
                  </div>
                </div>
                <span class="validation-hint">
                  <i class="material-icons">error_outline</i>
                  Anmerkungen sind nicht öffentlich sichtbar und dienen nur den Redakteur*innen.
                </span>
              </section>


              <section slot="placeTab">
                <div class="inputField__spacing" v-if="item.location">
                  <div class="input-field">
                    <label for="placename" :class="{active: (item.location.placename)}">Ortsbezeichnung (z.B. Hinterhof)</label>
                    <input  v-model="item.location.placename" id="placename" type="text" class="validate" />
                  </div>

                  <div class="input-field">
                    <label for="street" :class="{active: item.location.street}">Straße</label>
                    <input v-model="item.location.street" id="street" type="text" class="validate" @change="getGeocode(true)" />
                  </div>

                  <div class="input-field">
                    <label for="zip" :class="{active: item.location.zip}">Postleitzahl</label>
                    <input v-model="item.location.zip" id="zip" type="text" class="validate" @change="getGeocode(true)" />
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

                  <location-map :map-center="mapCenter" :location="item.location" :draggable="true" @bibbelDrag="bibbelDrag" :currentTab="currentTab"></location-map>

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
                <edit-contact-info ref="EditContactInfo" v-if="item"
                  :contact-info="item.contact"
                  :inheritance-state="item.inheritance.contact_infos"
                  :type="item.type"
                  :parent-orga="item.parent_orga"
                  @input="updateInheritedContactInfo">
                </edit-contact-info>
              </section>

              <section slot="networkMembersTab">
                <power-selector
                  :items="orgas"
                  :selected-items="item.network_members"
                  :search-fields="['title']"
                  @select="addNetworkMember"
                  @remove="removeNetworkMember"
                  :messages="{
                    addButtonTitle: 'Zum Netzwerk hinzufügen',
                    removeTitle: 'Aus dem Netzwerk austragen?',
                    removeMessage (item) {
                      return `Soll die Orga ${item.title} das Netzwerk verlassen?`
                    }
                  }"
                  v-if="orgas.length">
                  <div slot="selected-item" slot-scope="props">
                    <div>{{ props.item.title }}</div>
                  </div>
                  <div slot="item" slot-scope="props">
                    <div>{{ props.item.title }}</div>
                  </div>
                </power-selector>
              </section>

              <section slot="projectsTab">
                <power-selector
                  :items="orgas"
                  :selected-items="item.projects"
                  :search-fields="['title']"
                  @select="addProject"
                  @remove="removeProject"
                  :messages="{
                    addButtonTitle: 'Projekt hinzufügen',
                    removeTitle: 'Project entfernen?',
                    removeMessage (item) {
                      return `Soll das Projekt ${item.title} aus der Projektliste entfernt werden?`
                    }
                  }"
                  v-if="orgas.length">
                  <div slot="selected-item" slot-scope="props">
                    <div>{{ props.item.title }}</div>
                  </div>
                  <div slot="item" slot-scope="props">
                    <div>{{ props.item.title }}</div>
                  </div>
                </power-selector>
              </section>

              <section slot="resourceTab" v-if="item.type === 'orgas'">
                  <resource-item
                    v-for="resourceItem in item.resource_items"
                    :key="resourceItem.id"
                    :resourceItem="resourceItem"
                    v-on:remove="removeResourceItem"
                    :editEnabled="true">
                  </resource-item>
                  <div class="newResource">
                    <div>
                      <a href="" @click.prevent="addResourceItem"><i class="material-icons">add_circle</i></a>
                    </div>
                    <h2>
                      Neue Ressource hinzufügen
                    </h2>
                  </div>

              </section>
            </entry-tabbed-content>

            <br>
            <section class="entryForm__actionFooter">
              <button v-bind:class="[{disabled: currentlySaving}, 'btn', 'waves-effect', 'waves-light', 'saveButton']" type="submit">
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
import Vue from 'vue'
import autosize from 'autosize'
import Multiselect from 'vue-multiselect'
import { BASE } from '@/store/api'
import Orgas from '@/resources/Orgas'
import Categories from '@/resources/Categories'
import Annotations from '@/resources/Annotations'
import AnnotationCategories from '@/resources/AnnotationCategories'
import Users from '@/resources/Users'
import ResourceItems from '@/resources/ResourceItems'
import OrgaType from '@/models/OrgaType'
import sortByTitle from '@/helpers/sort-by-title'
import AnnotationTag from '@/components/AnnotationTag'
import Spinner from '@/components/Spinner'
import LocationMap from '@/components/Map'
import ImageContainer from '@/components/ImageContainer'
import EntryTabbedContent from '@/components/EntryTabbedContent'
import ResourceItem from '@/components/ResourceItem'
import PowerSelector from '@/components/PowerSelector'

import DatePicker from './Datepicker/DatePicker'
import EditContactInfo from './EditContactInfo'
import TagsSelectInput from './TagsSelectInput'
import InputField from '@/components/InputField'

import ValidationMixin from '../mixins/ValidationMixin'
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'

export default {
  props: ['id', 'options'],
  mixins: [ValidationMixin, RouteConfigAwareMixin],

  data () {
    const options = this.options || {}
    return {
      origItem: null,
      item: null,
      categories: [],
      annotationCategories: [],
      orgas: [],
      currentUser: null,

      imageError: false,
      loadingError: false,
      selectedAnnotation: null,
      orgasSimplified: [],
      // implemented as array to allow the :multiple="true" option on vue-multiselect
      // the limit is set to one. so this array contains one element max
      parentOrgaSimplified: [],

      networks: [],

      geodataLoading: false,
      geodataOfAddress: null,
      geocodeError: false,

      currentTab: '',
      currentlySaving: false,
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

        Orgas.getAllSimplified().then(orgas => {
          // remove current orga from array
          this.orgasSimplified = orgas.filter(orga => orga.id !== this.item.id)
        })

        this.currentUser = Users.getCurrentUser()
      } else {
        console.log('error loading item')
        this.loadingError = true
      }
    })
  },

  watch: {
    'item.contact' (contact) {
      if (contact) {
        this.checkAutosizeFields()
      }
    },
    'item.support_wanted_detail' (supportWantedDetail) {
      if (supportWantedDetail) {
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
    },
    /*
     * simplify orga list by removing circular references
     * gets passed as options for parent_orga select input
     */
    'orgas' (orgas) {
      let result = []
      let networks = []
      for (let orga of this.orgas) {
        if (this.item.id !== orga.id) {
          result.push({title: orga.title, id: orga.id})
          if (orga.orga_type_id === OrgaType.NETWORK) {
            networks.push({title: orga.title, id: orga.id})
          }
        }
      }
      this.orgasSimplified = result
      this.networks = networks
    },
    'item.parent_orga' (parentOrga) {
      if (parentOrga) {
        this.parentOrgaSimplified = [{title: this.item.parent_orga.title, id: this.item.parent_orga.id}]
      } else {
        this.parentOrgaSimplified = []
      }
    }
  },

  computed: {
    orgaTypes () {
      return OrgaType.TYPES
    },

    selectableAnnotations () {
      return this.annotationCategories.filter(
        (annotationCategory) => {
          // only allow editor annotationCategories
          if (!annotationCategory.generatedBySystem) {
            return true
          }
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
      let tabNames = ['generalTab', 'placeTab', 'contactTab']
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
    joinNetwork (network) {
      Orgas.joinActorRelation('network_members', network, this.item).then(result => {
        if (result) {
          this.item.networks.push(network)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ist jetzt im Netzwerk ${network.title}.`
          })
        }
      })
    },

    leaveNetwork (network) {
      Orgas.leaveActorRelation('network_members', network, this.item).then(result => {
        if (result) {
          this.item.networks = this.item.networks.filter(n => n.id !== network.id)
          this.$store.dispatch('messages/showAlert', {
            description: `Das Netzwerk ${network.title} wurde verlassen.`
          })
        }
      })
    },

    addNetworkMember (member) {
      Orgas.joinActorRelation('network_members', this.item, member).then(result => {
        if (result) {
          this.item.network_members.push(member)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${member.title} ist jetzt im Netzwerk.`
          })
        }
      })
    },

    removeNetworkMember (member) {
      Orgas.leaveActorRelation('network_members', this.item, member).then(result => {
        if (result) {
          this.item.network_members = this.item.network_members.filter(n => n.id !== member.id)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${member.title} hat das Netzwerk verlassen.`
          })
        }
      })
    },

    addProjectInitiator (initiator) {
      Orgas.joinActorRelation('projects', initiator, this.item).then(result => {
        if (result) {
          this.item.project_initiators.push(initiator)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ist jetzt Projekt von ${initiator.title}.`
          })
        }
      })
    },

    removeProjectIntiator (initiator) {
      Orgas.leaveActorRelation('projects', initiator, this.item).then(result => {
        if (result) {
          this.item.project_initiators = this.item.project_initiators.filter(pi => pi.id !== initiator.id)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${initiator.title} ist nicht mehr Projektträger.`
          })
        }
      })
    },

    addProject (project) {
      Orgas.joinActorRelation('projects', this.item, project).then(result => {
        if (result) {
          this.item.projects.push(project)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${project.title} ist jetzt ein Projekt.`
          })
        }
      })
    },

    removeProject (project) {
      Orgas.leaveActorRelation('projects', this.item, project).then(result => {
        if (result) {
          this.item.projects = this.item.projects.filter(p => p.id !== project.id)
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${project.title} ist kein Projekt mehr.`
          })
        }
      })
    },

    addPartner (partner) {
      Orgas.joinActorRelation('partners', this.item, partner).then(result => {
        if (result) {
          this.item.partners.push(partner)
          this.item.parent_orga = this.item.partners[0]
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${partner.title} ist jetzt Partnerorga.`
          })
        }
      })
    },

    removePartner (partner) {
      Orgas.leaveActorRelation('partners', this.item, partner).then(result => {
        if (result) {
          this.item.partners = this.item.partners.filter(p => p.id !== partner.id)
          this.item.parent_orga = this.item.partners.length ? this.item.partners[0] : null
          this.$store.dispatch('messages/showAlert', {
            description: `Die Orga ${partner.title} ist keine Partnerorga mehr.`
          })
        }
      })
    },

    /*
     * match back simplified parent_orga to full orga object from this.orgas
     */
    parentOrgaChanged () {
      if (this.parentOrgaSimplified.length === 0) {
        this.item.parent_orga = null
      } else {
        const parentOrga = this.orgas.find(x => x.id === this.parentOrgaSimplified[0].id)
        Orgas.get(parentOrga.id, ['fetchContact']).then(orga => {
          this.item.parent_orga = orga
        })
      }
    },
    /*
     * called by TagsSelectInput
     * sets the comma-sparated list on the tag attribute
     */
    tagsChanged (newTags) {
      this.item.tags = newTags
    },
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

        const supportWantedDetail = this.$el.querySelector('#supportWantedDetail')
        if (supportWantedDetail) {
          autosize(this.$el.querySelector('#supportWantedDetail'))
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

    addResourceItem () {
      let newResource = ResourceItems.createItem()
      this.item.resource_items.push(newResource)
    },

    removeAnnotation (annotation) {
      const index = this.item.annotations.indexOf(annotation)
      if (index !== -1) {
        this.item.annotations.splice(index, 1)
      }
    },

    removeResourceItem (resourceItem) {
      const index = this.item.resource_items.indexOf(resourceItem)
      if (index !== -1) {
        this.item.resource_items.splice(index, 1)
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
          this.currentlySaving = false
        } else {
          // fix for vee-validator which is currently not
          // able to deal with async validations:
          // https://github.com/logaretm/vee-validate/issues/356
          // using an async validator for image url, we always would
          // land in this block rather than in 'catch'
          if (this.imageError) {
            throw new Error()
          }
          this.currentlySaving = true
          // actual save routine on the resource
          this.Resource.save(this.item).then(entry => {
            if (entry) {
              this.$store.dispatch('messages/showAlert', {
                description: this.origItem.id ? this.messages.saveItemSuccess() : this.messages.addItemSuccess()
              })
              this.origItem = this.item // prevent route leave dialog after save
              this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}, query: {tab: this.currentTab}})
            }
            this.currentlySaving = false
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
          this.geocodeError = 'Geodaten nicht gefunden. Bitte Adresse anpassen.'
          this.geodataOfAddress = null
          if (updateItemLocation) { // do not set intial lat/lon to null in order to prevent the unsaved changes dialog to appear
            this.item.location.lat = null
            this.item.location.lon = null
          }
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
    Multiselect,
    EditContactInfo,
    TagsSelectInput,
    ResourceItem,
    InputField,
    PowerSelector
  }
}
</script>
