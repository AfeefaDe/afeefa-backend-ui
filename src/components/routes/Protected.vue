<template>
  <div>
    <section class="header hideDesktop">
      <navigation-mobile></navigation-mobile>
    </section>

    <section class="content">
      <section class="content__sidebar">
        <navigation-sidebar></navigation-sidebar>
      </section>

      <section class="content__main">
        <router-view></router-view>
      </section>
    </section>
  </div>
</template>

<script>
import NavigationSidebar from '@/components/navigation/NavigationSidebar'
import NavigationMobile from '@/components/navigation/NavigationMobile'
import Facet from '@/models/Facet'
import AnnotationCategory from '@/models/AnnotationCategory'

export default {
  components: {
    NavigationSidebar,
    NavigationMobile
  },

  created () {
    this.$store.dispatch('api/getMetaInformation')
    // Facets and annotations are used multiple times
    Facet.Query.getAll()
    AnnotationCategory.Query.getAll()
  }
}

</script>
