<template>
  <div class="search-container">
    <div class="search-field row">
      <afeefa-page>

        <afeefa-header slot="header">
          <div slot="title">{{ $t('headlines.search') }}</div>
        </afeefa-header>

        <search-items slot="content"
          :modifyRoute="true">
        </search-items>
      </afeefa-page>
    </div>
  </div>
</template>

<script>
import SearchItems from '@/components/SearchItems'

export default {
  components: { SearchItems }
}
</script>
