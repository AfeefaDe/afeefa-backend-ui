<template>
  <div
    class="facetItemTag"
    @click.prevent="facetItemClick(item)">

    <div
      :class="['facetItem', {selected, disabled, hasCheckbox: checkbox || radio}]"
      :style="{'border-left-color': color}">
      <div class="content">
        <div v-if="checkbox" class="checkbox">
          <input type="checkbox" :id="'facetItemTag' + item.id" class="filled-in checkboxSmall gray" :checked="checked" />
          <label :for="'facetItemTag' + item.id"></label>
        </div>
        <div v-if="radio" class="checkbox radio">
          <input type="radio" :id="'facetItemTag' + item.id" class="filled-in radioSmall gray" :checked="checked" />
          <label :for="'facetItemTag' + item.id"></label>
        </div>
        <div class="title">
          {{ title || item.title }}
        </div>
        <span class="hint" v-if="hint !== undefined" :style="{opacity: hint ? 1 : 0}">{{ hint }}</span>
      </div>
      <div class="more" v-if="more !== false" :style="{opacity: more ? 1 : 0}"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item', 'title', 'color', 'checkbox', 'radio', 'checked', 'selected', 'disabled', 'hint', 'more'],

  methods: {
    facetItemClick (item) {
      if (this.disabled) {
        return
      }
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.facetItemTag {
  display: flex;
  align-items: center;
}

.checkbox {
  margin-top: -.3em;
  margin-left: .2em;
  margin-right: .4em;
}

.facetItem {
  @include user-select();

  display: flex;
  padding: .2em;
  padding-left: .4em;
  cursor: pointer;
  border-left: 5px solid;
  white-space: nowrap;
  justify-content: space-between;

  &:not(.disabled):not(.hasCheckbox):not(.selected):hover {
    background-color: $white;
  }

  &.selected {
    background-color: darken($white, 5);
  }

  &.disabled {
    opacity: .4;
    cursor: auto;

    label {
      cursor: auto;
    }
  }

  .content {
    display: flex;
    align-items: center;
  }

  .hint {
    margin-top: 2px;
    font-size: .8em;
    margin-left: .4em;
    margin-right: .4em;
    color: $gray50;
  }

  .more {
    margin-left: .8em;
    margin-right: .2em;
  }

  .more:before {
    content: '';
    border-style: solid;
    border-color: $gray50;
    border-width: 0.25em 0.25em 0 0;
    display: inline-block;
    width: .7em;
    height: .7em;
    position: relative;
    top: 0;
    transform: rotate(45deg) scale(.6);
  }
}
</style>
