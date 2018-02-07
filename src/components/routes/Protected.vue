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
import Categories from '@/resources/Categories'
import AnnotationCategories from '@/resources/AnnotationCategories'

export default {
  components: {
    NavigationSidebar,
    NavigationMobile
  },

  created () {
    this.$store.dispatch('api/getMetaInformation')
    // categories and annotations are used multiple times
    Categories.getAll()
    AnnotationCategories.getAll()
  }
}

</script>
