<template>
  <entry-detail :component="this" :isEdit="true">

    <div v-if="offer">
      <form @submit.prevent="save" class="entryForm" novalidate>
        <title-input :item="item" />

        <div class="input-field">
          <label for="description" :class="{active: item.description}">
            {{ $t('entries.short_description') }}
            <span class="labelCharacterCount" v-if="item.description.length">{{item.description.length}}/350</span>
          </label>

          <textarea
            v-model="item.description"
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
          :item="item"
          :routeConfig="routeConfig"
          @remove="remove"
          @save="save" />
      </form>
    </div>

  </entry-detail>
</template>


<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OfferRouteConfig from './OfferRouteConfig'

import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

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
    TitleInput,
    DescriptionForm,
    EntryEditFooter
  }
}
</script>
