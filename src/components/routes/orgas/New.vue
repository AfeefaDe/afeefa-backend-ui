<template>
  <entry-edit
    id=""
    :routeConfig="routeConfig"
    ref="form">

    <div v-if="item">
      <div class="inputField__spacing">
        <label for="orgaType">Typ</label>
        <ul class="orgaTypeSelector">
          <li class="orgaTypeSelector__singleType" v-for="orgaType in orgaTypes"  :key="orgaType.id">
            <input
              class="with-gap"
              name="orgaType"
              type="radio"
              :id="orgaType.id"
              v-bind:checked="orgaType.id === 2"
              v-model="item.orga_type_id"
              :value="orgaType.id"/>
            <label :for="orgaType.id">{{$t('orgaTypes.'+orgaType.id+'.name')}}</label>
          </li>
        </ul>
        <div class="orgaTypeDescription">
          <i class="material-icons">info_outline</i>
          <p>{{$t('orgaTypes.'+this.item.orga_type_id+'.description')}}</p>
        </div>
      </div>

      <title-input :item="item"/>

      <category-selector :item="item" />

      <description-form :item="item" :options="{description: false}" />
    </div>

  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEditApiSlotMixin from '@/components/entry/edit/mixins/EntryEditApiSlotMixin'

import OrgaRouteConfig from './OrgaRouteConfig'
import OrgaType from '@/models/OrgaType'

import EntryEdit from '@/components/entry/edit/EntryEdit'
import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import CategorySelector from '@/components/entry/edit/CategorySelector'

export default {
  mixins: [BeforeRouteLeaveMixin, EntryEditApiSlotMixin],

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
<style lang="scss" scoped>
@import "~variables";
.orgaTypeSelector {
  margin: 0.5em 0;
  &__singleType {
    margin: 0 6vw 0 0;
    display: inline-block;
  }
  label {
    color: $black;
    font-size: 1rem;
    font-weight: 600;
  }
}
.orgaTypeDescription {
  display: inline-flex;
  align-items: center;
  padding: 0.5em 0.6em;
  margin: 0.5em 0;
  border-radius: $default-border-radius;
  background: $gray20;
  p {
    line-height: 150%;
    margin: 0;
  }
  i {
    vertical-align: middle;
    padding-right: 0.5em;
    font-size: 1.5rem;
  }
}

</style>
