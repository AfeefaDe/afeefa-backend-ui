<template>
  <entry-edit
    :id="id"
    :route-config="routeConfig"
    :options="{hasParentOrga: true, hasDelete: true}"
    ref="form">
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/EntryEdit/EntryEdit'
import OrgaRouteConfig from './OrgaRouteConfig'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  },

  components: {
    EntryEdit
  }
}
</script>
