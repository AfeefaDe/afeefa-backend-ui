<template>
  <afeefa-page>

    <afeefa-header slot="header">
      <div slot="title">
        {{ $tc('headlines.categories', 2) }}
      </div>
    </afeefa-header>

    <div slot="content" v-if="facetsLoaded">
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
        </div>
      </div>
    </div>

    <div slot="content" v-else>
      <entry-loading-message :messages="messages" />
    </div>

  </afeefa-page>
</template>

<script>
import Facet from '@/models/Facet'
import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'

export default {
  data () {
    return {
      facets: [],
      facetsLoaded: false,
      messages: {
        loadingItem: () => this.$t('status.load_categories')
      }
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
    EntryLoadingMessage
  }
}
</script>

<style lang="scss" scoped>
.facet {
  padding: 1em 0;

  &:not(:last-child) {
    border-bottom: 1px solid $gray20;
  }
}

.colorIcon {
  vertical-align: middle;
  display: inline-block;
  width: 5px;
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
</style>
