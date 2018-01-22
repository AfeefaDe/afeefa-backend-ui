<template>
  <entry-edit
    id=""
    :route-config="routeConfig"
    :options="{hasParentOrga: true}"
    ref="form">
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/entry/edit/EntryEdit'
import OrgaRouteConfig from './OrgaRouteConfig'

export default {
  mixins: [BeforeRouteLeaveMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this)
    }
  },

  components: {
    EntryEdit
  }
}
</script>
