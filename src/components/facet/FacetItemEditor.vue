<template>
  <div>
    <facet-item-tag :facetItem="facetItem" />

    <a href="" @click.prevent="cancel()" class="inlineEditLink">
      Abbrechen
    </a>

    <a href="" @click.prevent="move()" v-if="item.id && !isMove" class="inlineEditLink">
      Verschieben
    </a>
    <a href="" @click.prevent="edit()" v-if="isMove" class="inlineEditLink">
      Ändern
    </a>

    <a href="" @click.prevent="remove()" class="inlineEditLink">
      Löschen
    </a>

    <div class="editorForm">
      <facet-item-editor-form
        v-if="!isMove"
        :item="facetItem"
        :hasAttributes="true"
        :hasColor="hasColor"
        @update="update"
        @cancel="cancel" />

      <facet-item-editor-form
        v-else
        :item="facetItem"
        :hasMove="true"
        @update="update"
        @cancel="cancel">
        <select class="browser-default" @change="facetChanged" v-model="facetItem.facet">
          <option :value="facet" v-for="facet in facets" :key="facet.id">{{ facet.title }}</option>
        </select>

        <select class="browser-default" v-model="facetItem.parent" v-if="canSelectSubItems()">
          <option :value="null">Attribut auswählen</option>
          <option :value="parentItem" v-for="parentItem in facetItem.facet.facet_items" :key="parentItem.id">{{ parentItem.title }}</option>
        </select>

        <button type="button" class="btn btn-small" @click="update()">
          <i class="material-icons left">done</i>
        </button>
      </facet-item-editor-form>
    </div>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import FacetItemTag from '@/components/facet/FacetItemTag'
import FacetItemEditorForm from '@/components/facet/FacetItemEditorForm'
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

export default {
  props: ['item', 'hasColor'],

  data () {
    return {
      facetItem: null,
      facets: [],
      isMove: false
    }
  },

  created () {
    this.facetItem = this.item.clone()

    Facet.Query.getAll().then(facets => {
      this.facets = facets
    })
  },

  watch: {
    'facetItem.color' () {
      this.item.previewColor = this.facetItem.color
    }
  },

  methods: {
    edit () {
      this.facetItem = this.item.clone()
      this.isMove = false
    },

    move () {
      this.facetItem = this.item.clone()
      this.isMove = true
    },

    canSelectSubItems () {
      if (this.facetItem.sub_items.length) {
        return false
      }

      if (!this.facetItem.facet.facet_items.length) {
        return false
      }

      return true
    },

    facetChanged () {
      this.facetItem.parent = null
    },

    cancel () {
      this.item.previewColor = null
      this.$emit('cancel', this.facetItem)
    },

    remove () {
      this.$emit('remove', this.facetItem)
    },

    update () {
      this.$emit('update', this.facetItem)
    }
  },

  components: {
    FacetItemTag,
    FacetItemEditorForm,
    ColorPicker: Swatches
  }
}
</script>

<style lang="scss" scoped>
.facetItemTag {
  font-size: 1.1em;
}

.editorForm {
  margin-top: 2px;
}

.inlineEditLink {
  margin-left: 6px;
}
</style>
