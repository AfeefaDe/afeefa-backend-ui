<template>
  <entry-edit
    :id="id"
    :route-config="routeConfig"
    :options="{hasDate: true, hasOrga: true, hasDelete: true}"
    ref="form">
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/EntryEdit/EntryEdit'
import EventRouteConfig from './EventRouteConfig'

export default {
  mixins: [BeforeRouteLeaveMixin],

  props: ['id'],

  data () {
    return {
      routeConfig: new EventRouteConfig(this, this.id)
    }
  },

  components: {
    EntryEdit
  }
}
</script>
