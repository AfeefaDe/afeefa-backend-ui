<template>
  <entry-detail
    :entry="item"
    :routeConfig="routeConfig"
    :entry-loading-error="loadingError"
    :options="{hasParentOrga: true, hasEvents: true}">
  </entry-detail>
</template>


<script>
import EntryShowMixin from '@/components/mixins/EntryShowMixin'
import OrgaRouteConfig from './OrgaRouteConfig'

export default {
  mixins: [EntryShowMixin],

  data () {
    return {
      routeConfig: new OrgaRouteConfig(this, this.id)
    }
  }
}
</script>
