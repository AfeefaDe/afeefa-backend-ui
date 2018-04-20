<template>
  <afeefa-page>

    <entry-header v-if="offer" :entry="offer" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content" v-if="offer">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <offer-owners :owner="offer" relationName="owners" title="Träger">
          <div slot="actor" slot-scope="props">
            <router-link :to="{name: 'orgas.show', params: {id: props.actor.id}}">
              {{ props.actor.title }}
            </router-link>
          </div>
        </offer-owners>

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
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OfferRouteConfig from './OfferRouteConfig'

import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import OfferOwners from '@/components/entry/show/relations/OfferOwners'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      routeConfig: new OfferRouteConfig(this, this.id)
    }
  },

  computed: {
    offer () {
      return this.item
    }
  },

  components: {
    EntryEditFooter,
    TitleInput,
    DescriptionForm,
    OfferOwners
  }
}
</script>
