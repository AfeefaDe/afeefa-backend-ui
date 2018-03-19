<template>
  <div class="editor">
    <facet-item-tag :facetItem="facetItem" />

    <a href="" @click.prevent="cancel()">
      Abbrechen
    </a>

    <a href="" @click.prevent="move()" v-if="item.id && !isMove">
      Verschieben
    </a>
    <a href="" @click.prevent="edit()" v-if="isMove">
      Ändern
    </a>

    <a href="" @click.prevent="remove()" class="editLink">
      Löschen
    </a>

    <div>
      <div class="editorForm" v-if="!isMove">
        <input class="browser-default" type="text" placeholder="Titel"
          v-focus v-select
          v-model="facetItem.title"
          @keyup.enter="update()"
          @keyup.esc="cancel()">

        <color-picker
          v-if="hasColor"
          v-model="facetItem.color"
          colors="material-basic"
          class="colorPicker"
          :trigger-style="{width: '22px', height: '22px', borderRadius: '0px'}"
          row-length="10"
          swatch-size="20"
        />

        <input
          v-if="hasColor"
          class="browser-default colorInput"
          type="text"
          placeholder="Farbe"
          v-model="facetItem.color"
          @keyup.enter="update()"
          @keyup.esc="cancel()">

        <button type="button" class="btn btn-small" @click="update()">
          <i class="material-icons left">done</i>
        </button>
      </div>

      <div class="editorForm" v-else>
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
      </div>
    </div>
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import FacetItemTag from '@/components/facet/FacetItemTag'
import Swatches from 'vue-swatches'

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
    ColorPicker: Swatches
  }
}
</script>

<style lang="scss" scoped>
.facetItemTag {
  font-size: 1.1em;
}

.editor {
  .editorForm {
    display: inline-flex;
    align-items: center;
    margin-top: .2em;
    background-color: #EEEEEE;
    padding: .3em;
  }

  .editorForm > * {
    line-height: 1em;
    margin-right: .4em !important;
  }
}

.btn {
  margin-top: -1px;
  padding: 0 4px;
  i {
    font-size: 1rem;
  }
}

a {
  margin-left: 6px;
  color: $gray30;
  font-size: .8em;
  text-decoration: underline;

  &:hover {
    color: $secondaryBlue;
  }
}

.colorInput {
  width: 80px;
}
</style>
