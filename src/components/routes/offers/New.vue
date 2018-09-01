<template>
  <afeefa-page>

    <entry-header :entry="offer" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <editable-offer-owners :owner="offer" relationName="owners" title="Träger" showActors="true">
          <div slot="actor" slot-scope="props">
            <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
              {{ props.actor.title }}
            </router-link>
          </div>
        </editable-offer-owners>

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
          :routeConfig="routeConfig"
          @save="save" />
      </form>
    </div>

  </afeefa-page>
</template>


<script>
import Orga from '@/models/Orga'
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OfferRouteConfig from './OfferRouteConfig'

import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EditableOfferOwners from '@/components/actor/EditableOfferOwners'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  props: ['actorId'],

  data () {
    return {
      routeConfig: new OfferRouteConfig(this, this.id)
    }
  },

  created () {
    this.initActor()
  },

  watch: {
    '$route.query' () {
      this.initActor()
    }
  },

  computed: {
    offer () {
      return this.item
    }
  },

  methods: {
    setActor (actor) {
      const hasChanges = this.offer.hasChanges()
      if (actor) {
        this.offer.owners = [actor]
      } else {
        this.offer.owners = []
      }
      if (!hasChanges) {
        // prevent raising a dirty form dialog on leaving without changing data
        this.offer.markSaved()
      }
    },

    initActor () {
      if (this.$route.query.actorId) {
        Orga.Query.get(this.$route.query.actorId).then(actor => {
          this.setActor(actor)
        })
      } else {
        this.setActor(null)
      }
    }
  },

  components: {
    EntryEditFooter,
    TitleInput,
    DescriptionForm,
    EditableOfferOwners
  }
}
</script>
