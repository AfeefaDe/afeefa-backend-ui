<template>
  <div class="textAttribute">
      <p class="textAttribute__name">{{ name }}</p>
      <div :class="['textAttribute__container']">
        <div :class="['content', {multiline: isMultiline}, {editing: isEditing}]"
          contenteditable="true"
          ref="editable"
          v-on:focus="focusElement"
          v-on:blur="blurElement"
          @keyup.enter="save">
          {{attribute}}
        </div>
        <i v-show="isEditing" class="material-icons icon" v-on:click="save">check</i>
        <i v-show="!isEditing" class="material-icons icon" v-on:click="startEditing">edit</i>
      </div>
  </div>
</template>

<script>
export default {
  props: ['attribute', 'name', 'isMultiline'],
  data () {
    return {
      isEditing: false
    }
  },
  methods: {
    focusElement () {
      this.isEditing = true
    },
    blurElement () {
      this.isEditing = false
    },
    save () {
      console.log('@todo: save action')
    },
    startEditing () {
      this.$nextTick(() => this.$refs.editable.focus())
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
    transition: all 0.3s ease;
    .content {
        padding: 0.5em 0.2em;
        min-width: 200px;
        line-height: 160%;
        white-space: nowrap;
        overflow: hidden;
        outline: 0;
        border-bottom: 2px solid transparent;
        /* hover state */
        &:hover {
          border-bottom-color: $gray50;
        }
        /* edit state */
        &.editing {
          border-bottom-color: $green;
        }
        br {
          display: none;
        }
        * {
          display: inline;
          white-space: nowrap;
        }
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
    /* both states combined */
    &:hover, &.editing {
      .icon {
        font-size: 1.1rem;
      }
    }
  }
}

[contenteditable="true"] {
    white-space: nowrap;
    overflow: hidden;
}
[contenteditable="true"] br {
    display:none;
}
[contenteditable="true"] * {
    display:inline;
    white-space:nowrap;
}
</style>
