<template>
  <entry-detail
    :entry="item"
    :route-config="routeConfig"
    :entry-loading-error="loadingError"
    :options="{hasDate: true, hasOrga: true}">
  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import EventRouteConfig from './EventRouteConfig'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new EventRouteConfig(this, this.id)
    }
  }
}
</script>
