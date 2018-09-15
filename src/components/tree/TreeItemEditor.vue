<template>
  <div class="editorForm">
    <div class="controls">
      <icon-selector v-if="canSelectIcon" :selectedIcon="treeItem.icon" @select="selectIcon" />

      <input class="browser-default" type="text" placeholder="Titel"
        v-focus v-select
        v-model="treeItem.title"
        @keyup.enter="update()"
        @keyup.esc="cancel()">

      <div class="colorPicker" v-if="canColorize">
        <color-picker
          class="colorPickerIcon"
          v-model="treeItem.color"
          colors="material-basic"
          :trigger-style="{width: '22px', height: '22px', borderRadius: '0px'}"
          row-length="10"
          swatch-size="20"
        />

        <input
          class="browser-default colorInput"
          type="text"
          maxlength="7"
          placeholder="Farbe"
          v-model="treeItem.color"
          @keyup.enter="update()"
          @keyup.esc="cancel()">
      </div>
    </div>

    <div class="buttons">
      <a href="" @click.prevent="cancel()" class="inlineEditLink">
        Abbrechen
      </a>

      <a href="" @click.prevent="remove()" class="inlineEditLink">
        Löschen
      </a>

      <button type="button" class="btn btn-xs green" @click="update()">
        Speichern
      </button>
    </div>

    <tree-item-editor-form
      v-if="false"
      :item="treeItem"
      :hasColor="canColorize"
      :hasIcon="canSelectIcon"
      @update="update"
      @remove="remove"
      @cancel="cancel" />
  </div>
</template>

<script>
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import IconSelector from '@/components/selector/IconSelector'

export default {
  props: ['item', 'routeConfig'],

  data () {
    return {
      treeItem: null
    }
  },

  created () {
    this.treeItem = this.item.clone()
  },

  destroyed () {
    this.item.previewColor = null
  },

  watch: {
    'treeItem.color' () {
      this.item.previewColor = this.treeItem.color
    }
  },

  computed: {
    canColorize () {
      return this.routeConfig.canColorizeItems && !this.treeItem.parent
    },

    canSelectIcon () {
      return this.routeConfig.canSelectIcon
    }
  },

  methods: {
    selectIcon (icon) {
      this.treeItem.icon = icon
    },

    cancel () {
      this.item.previewColor = null
      this.$emit('cancel', this.treeItem)
    },

    remove () {
      this.$emit('remove', this.treeItem)
    },

    update () {
      this.$emit('update', this.treeItem)
    }
  },

  components: {
    ColorPicker: Swatches,
    IconSelector
  }
}
</script>

<style lang="scss" scoped>
.editorForm {
  display: inline-block;
  margin-top: .2em;
  margin-bottom: .4em;
  background-color: white;
  border: 1px solid $gray20;
  padding: 1em;

  input, select {
    width: auto;
    line-height: 1.5;
    height: 2em;
    padding: 0 .4em;
    border-left: none;
  }

  .colorInput {
    width: 80px;
  }
}

.editorForm > * {
  line-height: 1em;
  margin-right: .4em !important;
}

.colorPicker {
  display: flex;
  align-items: center;
}

.colorPickerIcon {
  width: 2em;
  height: 2em;
  border: 1px solid $gray20;
  position: relative;
  /* stylelint-disable selector-class-pattern */
  /deep/ .vue-swatches__trigger {
    width: 1.8em;
    height: 1.8em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  /* stylelint-enable selector-class-pattern */
}

.controls {
  display: flex;
  align-items: center;

  .colorPicker {
    margin-left: .8em;
  }
}

.buttons {
  margin-top: 1em;
  display: flex;
  align-items: baseline;
}

.btn {
  margin-top: -1px;
  padding: 0 4px;
  i {
    font-size: 1rem;
  }
}

a + button, a + a {
  margin-left: .7em;
}

.inlineEditLink {
  margin-left: 6px;
}
</style>
