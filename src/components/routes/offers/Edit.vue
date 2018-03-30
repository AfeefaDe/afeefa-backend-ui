<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard" v-if="offer">

        <div class="mainCard__header">
          <a href="" @click.prevent="goBack"><i class="material-icons goBack">chevron_left</i></a>

          <div class="mainCard__headerTitle">
            <span class="mainCard__type">{{ $tc('offers.offer') }}</span>
            <h2 class="mainCard__headerTitleHeading">{{ offer.title }}</h2>
            <span class="mainCard__headerSubtitle">
              <router-link :to="{name: 'orgas.show', params: {id: actor.id}}" v-for="actor in offer.actors" :key="actor.id">
                <u>{{ actor.title }}</u>
              </router-link>
            </span>
          </div>

          <div class="mainCard__headerButtonContainer">
            <a href="" @click.prevent="cancel" class="mainCard__headerAction"><i class="material-icons">cancel</i></a>
          </div>
        </div>

        <div>
          <h2>Kategorien</h2>

          <div v-for="facet in facets" :key="facet.id" v-if="facet.owner_types.includes('Offer')">
            <h2>{{ facet.title }}</h2>
            <facet-selector :owner="offer" :facet="facet" />
          </div>

          <h2>Titel und Beschreibung</h2>
          <title-input :item="offer" />

          <div class=" input-field">
            <label for="description" :class="{active: offer.description}">
              {{ $t('entries.short_description') }}
              <span class="labelCharacterCount" v-if="offer.description.length">{{offer.description.length}}/350</span>
            </label>

            <textarea
              v-model="offer.description"
              id="description"
              name="description"
              :data-vv-as="$t('entries.description')"
              v-validate.initial="'required|max: 350'"
              :class="['materialize-textarea', {'validation-error': errors.has('description') }]"
              v-autosize>
            </textarea>
            <span v-show="errors.has('description')" class="validation-error">{{ errors.first('description') }}</span>
          </div>
        </div>

        <div>
          <form @submit.prevent="save" class="entryForm" novalidate>
            <section class="entryForm__actionFooter">
              <button class="btn waves-effect waves-light saveButton" type="submit">
                <i class="material-icons left">done</i>
                {{ offer.id ? 'Speichern' : 'Anlegen' }}
              </button>
              <button class="btn waves-effect waves-light red" @click.prevent="remove" v-if="offer.id">
                <i class="material-icons left">delete</i>
                Löschen
              </button>
            </section>

          </form>
        </div>
      </div>

      <entry-loading-message v-else :error="hasItemLoadingError" :messages="messages" />
    </div>
  </div>
</template>


<script>
import Offer from '@/models/Offer'
import Facet from '@/models/Facet'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import FacetSelector from '@/components/facet/FacetSelector'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      offer: null,
      facets: [],
      hasItemLoadingError: false,
      messages: {
        loadingItem: () => this.$t('status.load_offer') + ' ' + this.id,
        loadingItemError: () => this.$t('errors.loadingOfferError') + ' ' + this.id,
        deleteItemDialogTitle: () => {
          return `Angebot löschen`
        },
        deleteItemDialogMessage: item => {
          return `Soll das Angebot "${item.title}" gelöscht werden?`
        },
        deleteItemSuccess: () => {
          return `Das Angebot wurde gelöscht.`
        },
        saveItemSuccess: () => {
          return `Das Angebot wurde gespeichert.`
        }
      }
    }
  },

  created () {
    Offer.Query.get(this.id).then(offer => {
      if (offer) {
        this.offer = offer.clone()
      } else {
        this.hasItemLoadingError = true
      }
    })

    Facet.Query.getAll().then(facets => {
      this.facets = facets
    })
  },

  methods: {
    goBack () {
      this.$router.go(-1)
    },

    cancel () {
      this.$router.push({name: 'offers.show', params: {id: this.id}})
    },

    $canLeaveRoute () {
      if (this.offer && this.offer.hasChanges()) {
        return 'Soll das Editieren beendet werden?'
      }
      return true
    },

    save () {
      this.$validator.setLocale(this.$i18n.locale)

      this.$validator.validateAll().then(result => {
        let validationErrors = []
        if (!result) {
          validationErrors = this.$validator.errors.items
        }

        // prepare errorString from all validationErrors
        let errorString = '\n\n'
        for (let validationError of validationErrors) {
          errorString += validationError.msg + '\n'
        }

        // at least one error occured during the validation
        if (validationErrors.length) {
          this.$store.dispatch('messages/showAlert', {
            isError: true,
            autoHide: false,
            description: 'Es sind leider noch Fehler im Formular!' + errorString
          })
        } else {
          // actual save routine on the resource
          Offer.Query.save(this.offer).then(offer => {
            if (offer) {
              this.$store.dispatch('messages/showAlert', {
                description: this.offer.id ? this.messages.saveItemSuccess() : this.messages.addItemSuccess()
              })
              this.$router.push({name: 'offers.show', params: {id: offer.id}})
            }
          })
        }
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.deleteItemDialogTitle(),
        message: this.messages.deleteItemDialogMessage(this.offer)
      }).then(result => {
        if (result === 'yes') {
          Offer.Query.delete(this.offer).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.deleteItemSuccess()
              })
              this.$router.push({name: 'offers.list'})
            }
          })
        }
      })
    }
  },

  components: {
    EntryLoadingMessage,
    TitleInput,
    DescriptionForm,
    FacetSelector
  }
}
</script>
