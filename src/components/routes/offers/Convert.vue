<template>
  <afeefa-page>

    <entry-header :entry="offer" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <div class="info">
        <h2>Akteur in Angebot umwandeln</h2>
        <ul class="browser-default">
          <li>Titel und Beschreibung,</li>
          <li>Kontaktdaten,</li>
          <li>Navigationseinträge und</li>
          <li>Anmerkungen werden übernommen.</li>
          <li>Träger des Akteurs werden zu Trägern des neuen Angebots.</li>
          <li class="marginTop">Veranstaltungen bleiben erhalten, jedoch wird der Veranstalter entfernt.</li>
          <li>Projekte bleiben erhalten, jedoch wird der Träger entfernt.</li>
          <li class="marginTop">Kategorien werden nicht übernommen.</li>
          <li>Existierende Angebote werden gelöscht.</li>
          <li>Alle anderen Daten sowie der Akteur selbst werden gelöscht.</li>
        </ul>
      </div>

      <form @submit.prevent="save" class="entryForm" novalidate>
        <editable-offer-owners :owner="offer" relationName="owners" title="Träger" showActors="true">
          <div slot="actor" slot-scope="props">
            <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
              {{ props.actor.title }}
            </router-link>
          </div>
        </editable-offer-owners>

        <title-input :item="offer" class="formElement marginTop" />

        <text-input
          class="formElement marginTop"
          v-model="offer.description"
          fieldName="description"
          :label="$t('entries.description')"
          :placeholder="$t('entries.description')"
          validate="required|max:350" />

        <contact-list :item="offer" v-if="false" />

        <entry-edit-footer
          :item="offer"
          :routeConfig="routeConfig"
          @save="checkSave" />
      </form>
    </div>

  </afeefa-page>
</template>


<script>
import App from 'uidata/model/App'
import Orga from '@/models/Orga'
import Offer from '@/models/Offer'
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OfferRouteConfig from './OfferRouteConfig'

import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EditableOfferOwners from '@/components/actor/EditableOfferOwners'
import ContactList from '@/components/contact/ContactList'
import Resource from 'uidata/resource/Resource'

class ConvertResource extends Resource {
  url = 'offers/convert_from_actor{/id}'

  getListType () {
    return 'offers_convert'
  }

  getItemModel () {
    return Offer
  }

  ensureReverseRelationsAfterAddOrSave (offer) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(offer)
    ensure.reloadAlways(App.getRelationByModel(Orga))
    return ensure
  }
}
const Query = new ConvertResource()

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  props: ['actorId'],

  data () {
    return {
      actor: null,
      routeConfig: new OfferRouteConfig(this, this.id)
    }
  },

  created () {
    this.initActor()
  },

  computed: {
    Query () {
      return Query
    },

    offer () {
      return this.item
    }
  },

  methods: {
    setActor (actor) {
      const hasChanges = this.offer.hasChanges()
      if (actor) {
        this.offer.convertFromActorId = actor.id
        this.offer.owners = actor.project_initiators
        this.offer.title = actor.title
        this.offer.description = actor.short_description || actor.description
        this.offer.image_url = actor.media_url
        this.offer.contacts = actor.contacts
      } else {
        this.offer.owners = []
      }
      if (!hasChanges) {
        // prevent raising a dirty form dialog on leaving without changing data
        this.offer.markSaved()
      }
      this.actor = actor
    },

    initActor () {
      if (this.$route.query.actorId) {
        Orga.Query.get(this.$route.query.actorId).then(actor => {
          this.setActor(actor)
        })
      } else {
        this.setActor(null)
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
    EditableOfferOwners,
    ContactList
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: inline-block;
  border: 1px solid #CC9999;
  padding: 1em;
  margin-bottom: 3em;
  h2 {
    font-size: 1em;
    font-weight: bold;
    margin: 0;
  }
  ul {
    margin-bottom: 0;
    padding-left: 1.5em;
  }
  .marginTop {
    margin-top: 1em;
  }
}
</style>

