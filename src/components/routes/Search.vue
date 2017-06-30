<template>
  <div class="search-container">

    <div class="row search-field">
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

    <div class="mainCard search-sidebar">
      <div>
        <search-sidebar-element> </search-sidebar-element>
      </div>
      <div>
        <fieldset>
          <legend>Zeige</legend>
          <div class="switch-toggle switch-candy">
            <input id="orgas" name="view" type="radio">
            <label for="orgas" onclick="">Orgas</label>

            <input id="both" name="view" type="radio" checked>
            <label for="both" onclick="">Beides</label>

            <input id="events" name="view" type="radio">
            <label for="events" onclick="">Events</label>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>


<script>
import SearchItems from '@/components/SearchItems'
import SearchSidebarElement from '@/components/SearchSidebarElement'

export default {
  components: { SearchItems, SearchSidebarElement }
}
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.search-field {
  flex-grow: 3;
}
.search-sidebar {
  flex-grow: 1;
  background-color: lightblue;
}

</style>
