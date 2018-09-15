<template>
  <div>
    <navigation-mobile class="hideDesktop" />

    <section class="content">
      <section class="content__sidebar">
        <navigation-sidebar />
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
import Navigation from '@/models/Navigation'

export default {
  components: {
    NavigationSidebar,
    NavigationMobile
  },

  created () {
    this.$store.dispatch('api/getMetaInformation')
    // Facets and annotations are used multiple times
    Facet.Query.getAll()
    Navigation.Query.get()
    AnnotationCategory.Query.getAll()
  }
}

</script>


<style lang="scss" scoped>
.navigationMobile {
  margin-bottom: -1em;
  width: 100%;
  text-align: center;
}
</style>
