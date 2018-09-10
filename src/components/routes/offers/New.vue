<template>
  <afeefa-page>

    <entry-header :entry="offer" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
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
import ActorSelector from '@/components/actor/ActorSelector'

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
    ActorSelector
  }
}
</script>

<style lang="scss" scoped>
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
