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
import NavigationSidebar from '@/components/NavigationSidebar'
import NavigationMobile from '@/components/NavigationMobile'

export default {
  components: {
    NavigationSidebar,
    NavigationMobile
  }
}

</script>
