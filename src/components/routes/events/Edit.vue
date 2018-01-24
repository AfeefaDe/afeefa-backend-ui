<template>
  <event-edit
    :id="id"
    :routeConfig="routeConfig"
    ref="form" />
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EventEdit from '@/components/event/EventEdit'
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
    EventEdit
  }
}
</script>
