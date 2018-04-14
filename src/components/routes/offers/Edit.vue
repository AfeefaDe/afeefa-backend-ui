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

          <entry-edit-footer
            :item="offer"
            @remove="remove"
            @save="save"
            @cancel="cancel" />
        </div>
      </div>

      <entry-loading-message v-else :error="hasItemLoadingError" :messages="messages" />
    </div>
  </div>
</template>


<script>
import Offer from '@/models/Offer'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      offer: null,
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
    EntryEditFooter,
    TitleInput,
    DescriptionForm
  }
}
</script>
