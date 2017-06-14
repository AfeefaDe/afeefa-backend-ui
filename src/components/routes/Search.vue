<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Search </h2>
        </div>
        <div>
          <search-items :modifyRoute="true"></search-items>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import SearchItems from '@/components/SearchItems'
export default {
  components: { SearchItems }
}
</script>
