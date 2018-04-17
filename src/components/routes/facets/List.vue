<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">Kategorien</h2>
        </div>

        <div v-if="!facetsLoaded" class="loadingInfo">
          <spinner :show="true" :width="1" :radius="5" :length="3" /> {{ $t('status.load_categories') }}
        </div>

        <div v-else>
          <div v-for="facet in facets" :key="facet.id" class="facet">
            <div>

              <div class="facetAttributes">
                <div class="facetAttributesView">
                  <div :style="{'background-color': facet.color}" class="colorIcon"></div>
                  <router-link :to="{name: 'facets.show', params: {id: facet.id}}" class="title">
                    <h4>{{ facet.title }}</h4>
                  </router-link>
                </div>
              </div>

              <div class="ownerTypes">
                für: <span v-for="type in facet.owner_types" :key="type" class="ownerType">{{ $t('facets.ownerType' + type) }}</span>
              </div>
              <div>
                {{ countItems(facet) }} Kategorien {{ countOwners(facet) }} Einträge zugeordnet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import Spinner from '@/components/Spinner'

export default {
  data () {
    return {
      facets: [],
      facetsLoaded: false
    }
  },

  created () {
    this.loadFacets()
  },

  methods: {
    countItems (facet) {
      return facet.getAllFacetItems().length
    },

    countOwners (facet) {
      return facet.getAllFacetItems().reduce((count, item) => {
        return count + item.count_owners
      }, 0)
    },

    loadFacets () {
      Facet.Query.getAll().then(facets => {
        this.facets = facets
        this.facetsLoaded = true
      })
    }
  },

  components: {
    Spinner
  }
}
</script>

<style lang="scss" scoped>
.loadingInfo {
  margin-top: .8em;
}

.facet {
  padding: 1em 0;

  &:not(:last-child) {
    border-bottom: 1px solid $gray20;
  }
}

.colorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

.facetAttributes {
  margin-bottom: 10px;
}

.facetAttributesView {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  a.title {
    color: inherit;
  }

  h4 {
    line-height: 1em;
    font-size: 1.4em;
    font-weight: 500;
    margin: 0;
  }
}

.ownerType:not(:last-child) {
  &:after {
    content: ', ';
  }
}

.ownerTypes {
  font-size: .9em;
  color: $gray50;
}

.facetItemTagList {
  max-width: 800px;
}
</style>
