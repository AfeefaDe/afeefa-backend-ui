<template>
  <entry-edit
    id=""
    :route-config="routeConfig"
    :options="{hasDate: true, hasOrga: true}"
    ref="form">
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/EntryEdit/EntryEdit'
import EventRouteConfig from './EventRouteConfig'

export default {
  mixins: [BeforeRouteLeaveMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this)
    }
  },

  components: {
    EntryEdit
  }
}
</script>
