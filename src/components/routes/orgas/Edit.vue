<template>
  <actor-edit
    :id="id"
    :route-config="routeConfig"
    ref="form">
  </actor-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import ActorEdit from '@/components/actor/ActorEdit'
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
    ActorEdit
  }
}
</script>
