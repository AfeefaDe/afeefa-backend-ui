<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">

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
            <router-link :to="{name: 'offers.list'}">
              <i class="material-icons">cancel</i>
            </router-link>
          </div>
        </div>

        <div>
          <h2>Akteur</h2>

          <power-selector
            :items="actors"
            :selected-items="offer.actors"
            :search-fields="['title']"
            @select="actorChanged"
            @remove="actorRemoved"
            :messages="{
              addButtonTitle: 'Akteur hinzufügen',
              removeTitle: 'Akteur entfernen?',
              removeMessage: actor => {
                return `Soll der Akteur entfernt werden?`
              }
            }">
            <div slot="selected-item" slot-scope="props">
              <div>{{ props.item.title }}</div>
            </div>
            <div slot="item" slot-scope="props">
              <div>{{ props.item.title }}</div>
            </div>
          </power-selector>

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
                Anlegen
              </button>
            </section>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Offer from '@/models/Offer'
import Orga from '@/models/Orga'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import PowerSelector from '@/components/PowerSelector'

export default {
  mixins: [BeforeRouteLeaveMixin],

  data () {
    return {
      offer: null,
      actors: [],
      messages: {
        addItemSuccess: () => {
          return `Das Angebot wurde gespeichert.`
        }
      }
    }
  },

  created () {
    const offer = new Offer()
    this.offer = offer.clone() // create clone in order to track changes

    Orga.Query.getAll().then(orgas => {
      this.actors = orgas
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

    actorChanged (actor) {
      this.offer.actors = [actor]
    },

    actorRemoved () {
      this.offer.actors = []
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
                description: this.messages.addItemSuccess()
              })
              this.$router.push({name: 'offers.show', params: {id: offer.id}})
            }
          })
        }
      })
    }
  },

  components: {
    TitleInput,
    DescriptionForm,
    PowerSelector
  }
}
</script>
