<template>
  <div class="search-container">
    <div class="search-field row">
      <div class="col s12 m12">
        <div class="mainCard">
          <div class="mainCard__header">
            <h2 class="mainCard__headerTitle"> {{$t('headlines.search')}} </h2>
          </div>
          <div>
            <search-items
              :modifyRoute="true">
            </search-items>
          </div>
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
