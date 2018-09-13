<template>
  <afeefa-page>

    <entry-header :entry="offer" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content" v-if="actor">
      <div class="info">
        <i class="material-icons">error_outline</i>
        <div>
          <h2>Akteur in Angebot umwandeln, ganz einfach <i class="material-icons">sentiment_very_satisfied</i></h2>
          <ul class="browser-default">
            <li>Titel und Beschreibung, Bild, Kontaktdaten, Navigationseinträge und Anmerkungen werden übernommen.</li>
            <li>Träger des Akteurs werden zu Trägern des neuen Angebots.</li>
            <li class="marginTop">Existierende Angebote, Veranstaltungen oder Projekte bleiben erhalten und werden entweder den vorhandenen Trägern des Akteurs zugeordnet oder aber verlieren zunächst ihre Zugehörigkeit. Sie werden dann weiter ohne Probleme angezeigt und können später jederzeit neu zugeordnet werden.</li>
            <li class="marginTop">Kategorien werden nicht übernommen.</li>
            <li>Alle anderen Daten sowie der Akteur selbst werden gelöscht.</li>
          </ul>
        </div>
      </div>

      <form @submit.prevent="save" class="entryForm" novalidate>
        <entry-detail-property2 title="Träger" icon="group" class="projectInitiators">
          <actor-selector :actor="offer" relationName="owners" title="Träger" />
        </entry-detail-property2>

        <title-input :item="offer" class="formElement marginTop" />

        <text-input
          class="formElement marginTop"
          v-model="offer.short_description"
          fieldName="short_description"
          :label="$t('entries.short_description')"
          :placeholder="$t('entries.short_description')"
          validate="required|max:350" />

        <text-input
          class="formElement marginTop"
          v-model="offer.description"
          fieldName="description"
          :label="$t('entries.description')"
          :placeholder="$t('entries.description')" />

        <contact-list :item="offer" v-if="false" />

        <entry-edit-footer
          :item="offer"
          :routeConfig="routeConfig"
          @save="checkSave" />
      </form>
    </div>

    <div slot="content" v-else>
      <entry-loading-message :error="loadingError" :messages="actorMessages" />
    </div>

  </afeefa-page>
</template>


<script>
import Orga from '@/models/Orga'
import ConvertActorToOfferResource from '@/resources/custom/ConvertActorToOffer'

import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OfferRouteConfig from './OfferRouteConfig'
import OrgaRouteConfig from '@/components/routes/orgas/OrgaRouteConfig'

import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import ContactList from '@/components/contact/ContactList'
import ActorSelector from '@/components/actor/ActorSelector'


export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  props: ['actorId'],

  data () {
    return {
      actor: null,
      ConvertQuery: null,
      routeConfig: new OfferRouteConfig(this, this.id),
      actorMessages: new OrgaRouteConfig(this, this.$route.query.actorId).messages
    }
  },

  created () {
    this.ConvertQuery = new ConvertActorToOfferResource(this.$route.query.actorId)
    this.initActor()
  },

  computed: {
    Query () {
      return this.ConvertQuery
    },

    offer () {
      return this.item
    }
  },

  methods: {
    setActor (actor) {
      if (actor) {
        this.offer.convertFromActorId = actor.id
        this.offer.owners = actor.project_initiators
        this.offer.title = actor.title
        this.offer.short_description = actor.short_description
        this.offer.description = actor.description
        this.offer.image_url = actor.media_url
        this.offer.contacts = actor.contacts
      } else {
        this.offer.owners = []
      }
      this.offer.markSaved()
      this.actor = actor
    },

    initActor () {
      if (this.$route.query.actorId) {
        Orga.Query.get(this.$route.query.actorId).then(actor => {
          if (actor) {
            this.setActor(actor)
          } else {
            this.loadingError = true
          }
        })
      } else {
        this.loadingError = true
      }
    },

    checkSave () {
      this.$store.dispatch('messages/showDialog', {
        title: 'Akteur in Angebot umwandeln',
        message: `Soll der Akteur "${this.actor.title}" in ein Angebot umgewandelt werden?`
      }).then(result => {
        if (result === 'yes') {
          this.save()
        }
      })
    }
  },

  components: {
    EntryEditFooter,
    TitleInput,
    DescriptionForm,
    ActorSelector,
    ContactList
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  align-items: center;
  border: 1px solid $gray20;
  padding: .8em;
  margin-bottom: 3em;
  h2 {
    display: flex;
    align-items: center;
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    padding-left: 1.5em;

    i {
      margin-left: .3em;
    }
  }
  ul {
    margin-bottom: 0;
    padding-left: 1.5em;
  }
  .marginTop {
    margin-top: 1em;
  }
  i {
    font-size: 20px;
    margin-right: 1em;
  }
}

.entryDetailProperty.projectInitiators {
  /deep/ .title {
    font-size: .9rem;
  }
  /deep/ .editLink {
    top: 0;
    left: .5em;
  }
}

.editableActors {
  margin-top: .8em;
}
</style>

