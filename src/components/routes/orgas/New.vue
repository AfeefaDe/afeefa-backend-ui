<template>
  <entry-edit
    id=""
    :route-config="routeConfig"
    ref="form">

    <div v-if="item">
      <div class="inputField__spacing">
        <label for="orgaType">Typ</label>
        <select v-model="item.orga_type_id" id="orgaType"
          name="orgaType"
          class="browser-default">
          <option :value="orgaType.id" v-for="orgaType in orgaTypes" :key="orgaType.id">{{ orgaType.name }}</option>
        </select>
      </div>

      <title-input :item="item" />

      <category-selector :item="item" />

      <description-form :item="item" :options="{description: false}" />
    </div>

  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EditEntrySlotMixin from '@/components/entry/edit/mixins/EditEntrySlotMixin'

import OrgaRouteConfig from './OrgaRouteConfig'
import OrgaType from '@/models/OrgaType'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import CategorySelector from '@/components/entry/edit/CategorySelector'

export default {
  mixins: [BeforeRouteLeaveMixin, EditEntrySlotMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this)
    }
  },

  computed: {
    orgaTypes () {
      return OrgaType.TYPES
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
