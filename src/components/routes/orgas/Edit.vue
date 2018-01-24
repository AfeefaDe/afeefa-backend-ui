<template>
  <entry-edit
    :id="id"
    :route-config="routeConfig"
    ref="form">
    <div slot-scope="{item, currentUser, imageError}" >
      <actor-edit
        :item="item"
        :currentUser="currentUser"
        :imageError="imageError" />
    </div>
  </entry-edit>
</template>

<script>
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEdit from '@/components/entry/edit/EntryEdit'
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
    EntryEdit,
    ActorEdit
  }
}
</script>
