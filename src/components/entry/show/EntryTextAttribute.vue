<template>
  <div class="textAttribute">
      <p class="textAttribute__name">{{ name }}</p>
      <div :class="['textAttribute__container', {editing: isEditing}, {dirty: isDirty}]">
        <input type="text" :class="['browser-default', 'input']"
          ref="editable"
          v-model="value"
          v-on:focus="focusElement"
          v-on:blur="blurElement"
          @keyup.enter="save"
          @input="updateValue($event.target.value)"
          />
        <i v-show="saveButtonVisible" class="material-icons icon" v-on:click="save">check</i>
        <i v-show="!isEditing" class="material-icons icon" v-on:click="startEditing">edit</i>
      </div>
  </div>
</template>

<script>
export default {
  props: ['attribute', 'name', 'isMultiline'],
  data () {
    return {
      isEditing: false,
      isDirty: false,
      saveButtonVisible: false,
      value: ''
    }
  },
  created () {
    this.value = this.attribute
  },
  watch: {
    attribute () {
      this.value = this.attribute
    }
  },
  methods: {
    startEditing () {
      this.$nextTick(() => this.$refs.editable.focus())
    },
    focusElement () {
      this.isEditing = true
    },
    blurElement () {
      this.isEditing = false
      if (this.isDirty) {
        this.isDirty = false
        this.value = this.attribute
      }
    },
    save () {
      console.log('@todo: save action')
      this.$emit('save')
      this.saveButtonVisible = false
    },
    updateValue (value) {
      if (value === this.attribute) {
        this.isDirty = false
        this.saveButtonVisible = false
      } else {
        this.isDirty = true
        this.saveButtonVisible = true
        this.$emit('input', value)
      }
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
    .input {
        padding: 0.5em 0.2em;
        min-width: 200px;
        line-height: 160%;
        white-space: nowrap;
        overflow: hidden;
        outline: 0;
        border: 0;
        border-bottom: 2px solid transparent;
        /* hover state */
        &:hover {
          border-bottom-color: $gray50;
        }
    }
    /* edit state */
    &.editing {
      .input {
        border-bottom-color: $green;
      }
    }
    &.dirty {
      .input {
        border-bottom-color: $yellow;
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
</style>
