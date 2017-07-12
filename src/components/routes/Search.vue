<template>
  <div class="search-container">

    <div class="search-field row">
      <div class="col s12 m12">
        <div class="mainCard">
          <div class="mainCard__header">
            <h2 class="mainCard__headerTitle">Search </h2>
          </div>
          <div>
            <search-items
              :modifyRoute="true"
              :typeFilter="typeFilterState">
            </search-items>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="search-sidebar mainCard">
      <div>
          <div class="switch-toggle switch-candy switch-candy-blue">
            <input id="orgas" name="view" type="radio" value="orgas" v-model="typeFilterState">
            <label for="orgas" onclick="">Orgas</label>

            <input id="both" name="view" type="radio" value="none" v-model="typeFilterState">
            <label for="both" onclick="">Beides</label>

            <input id="events" name="view" type="radio" value="events" v-model="typeFilterState">
            <label for="events" onclick="">Events</label>

            <a></a>
          </div>
      </div>
      <div>
        <search-sidebar-element> </search-sidebar-element>
      </div>
    </div> -->
  </div>
</template>


<script>
import SearchItems from '@/components/SearchItems'
import SearchSidebarElement from '@/components/SearchSidebarElement'

export default {
  props: [],
  data () {
    return {
      typeFilterState: 'none'
    }
  },
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
}

/* hide radio button circles from materialize */
[type="radio"]:not(:checked)+label, [type="radio"]:checked+label {
  padding-left: 5px;
}
label::before {
  display: none;
}
label::after {
  display: none;
}

</style>
