<template>
  <div class="textAttribute">
      <p class="textAttribute__name">{{ name }}</p>
      <div :class="['textAttribute__container', {editing: isEditing}]">
        <p :class="['content', {multiline: isMultiline}]"
          contenteditable="true"
          ref="editable"
          v-on:focus="focusElement"
          v-on:blur="blurElement">
          <slot/>
        </p>
        <i v-if="isEditing" class="material-icons icon" v-on:click="saveElement">check</i>
        <i v-else class="material-icons icon" v-on:click="focusElement">edit</i>
      </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'isMultiline'],
  data () {
    return {
      isEditing: false
    }
  },
  methods: {
    focusElement () {
      this.isEditing = true
      this.$nextTick(() => this.$refs.editable.focus())
    },
    blurElement () {
      this.isEditing = false
      this.$nextTick(() => this.$refs.editable.blur())
    },
    saveElement () {
      console.log('@todo: save action')
    }
  }
}
</script>

<style lang="scss" scoped>
.textAttribute {
  margin: 2em 0;
  &__name {
    text-transform: uppercase;
    color: $gray50;
    margin: 0;
  }
  &__container {
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
    .content {
        padding: 0.5em 0.2em;
        flex-grow: 2;
        margin: 0;
        line-height: 160%;
        white-space: nowrap;
        outline: 0;
        &.multiline * { /* '*' means: ignore v-if=false comments that force empty lines */
          white-space: pre-wrap;
        }
    }
    .icon {
      font-size: 0;
      padding: 0 0.2em;
      color: $gray50;
      cursor: pointer;
    }

    /* hover state */
    &:hover {
      border-bottom-color: $gray50;
    }
    /* edit state */
    &.editing {
      border-bottom-color: $green;
    }
    /* both states combined */
    &:hover, &.editing {
      .icon {
        font-size: 1.3rem;
        color: $black;
      }
    }
  }
}

</style>
