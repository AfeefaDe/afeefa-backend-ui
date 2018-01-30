<template>
  <entry-edit
    id=""
    :route-config="routeConfig"
    ref="form">

    <div v-if="item">
      <title-input :item="item" />

      <category-selector :item="item" />

      <description-form :item="item" :options="{description: false}" />
    </div>

  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EditEntrySlotMixin from '@/components/entry/edit/mixins/EditEntrySlotMixin'

import EventRouteConfig from './EventRouteConfig'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import TitleInput from '@/components/entry/edit//TitleInput'
import DescriptionForm from '@/components/entry/edit//DescriptionForm'
import CategorySelector from '@/components/entry/edit//CategorySelector'

export default {
  mixins: [BeforeRouteLeaveMixin, EditEntrySlotMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this)
    }
  },

  components: {
    EntryEdit,
    TitleInput,
    DescriptionForm,
    CategorySelector
  }
}
</script>
