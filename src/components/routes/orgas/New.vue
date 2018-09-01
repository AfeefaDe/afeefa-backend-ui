<template>
  <afeefa-page>

    <entry-header :entry="orga" :isEdit="true" :routeConfig="routeConfig" slot="header" />

    <div slot="content">
      <form @submit.prevent="save" class="entryForm" novalidate>
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
                v-model="orga.orga_type_id"
                :value="orgaType.id"/>
              <label :for="orgaType.id">{{$t('orgaTypes.'+orgaType.id+'.name')}}</label>
            </li>
          </ul>
          <div class="orgaTypeDescription">
            <i class="material-icons">info_outline</i>
            <p>{{$t('orgaTypes.'+this.orga.orga_type_id+'.description')}}</p>
          </div>
        </div>

        <title-input :item="orga"/>

        <description-form :item="orga" :options="{description: false}" />

        <entry-edit-footer
          :item="orga"
          :routeConfig="routeConfig"
          @save="save" />
      </form>
    </div>

  </afeefa-page>
</template>


<script>
import EntryEditMixin from '@/components/mixins/EntryEditMixin'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import OrgaRouteConfig from './OrgaRouteConfig'
import OrgaType from '@/models/OrgaType'

import TitleInput from '@/components/entry/edit/TitleInput'
import DescriptionForm from '@/components/entry/edit/DescriptionForm'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

export default {
  mixins: [EntryEditMixin, BeforeRouteLeaveMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this)
    }
  },

  computed: {
    orga () {
      return this.item
    },

    orgaTypes () {
      return OrgaType.TYPES
    }
  },

  components: {
    TitleInput,
    DescriptionForm,
    EntryEditFooter
  }
}
</script>


<style lang="scss" scoped>
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
