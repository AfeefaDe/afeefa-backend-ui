<template>
  <div>
    <modal ref="modal" class="modalWindow">
      <div class="modalContent">
        <h3>Anmerkung hinzufügen</h3>
        {{ entry.title }}
        <annotation-form :entry="entry" :annotationToEdit="annotation"
          @save="saved" @close="hideModal"
          class="formElement marginTop" />
      </div>
    </modal>

    <div @click="showModal">
      <slot name="triggerButton">
        <button class="btn gray btn-small">
          <i class="material-icons left">add</i>
          Aufgabe
        </button>
      </slot>
    </div>
  </div>

</template>

<script>
import Annotation from '@/models/Annotation'
import Modal from '@/components/Modal'
import AnnotationForm from './AnnotationForm'

export default {
  props: ['entry'],

  data () {
    return {
      annotation: null
    }
  },

  created () {
    this.annotation = new Annotation()
  },

  methods: {
    showModal () {
      this.annotation = new Annotation()
      this.$refs.modal.show()
    },

    hideModal () {
      this.$refs.modal.close()
    },

    saved () {
      if (!this.annotation.id) {
        this.entry.$rels.annotations.refetch()
      }
      this.hideModal()
    }
  },

  components: {
    Modal,
    AnnotationForm
  }
}
</script>

<style lang="scss" scoped>
.modalWindow /deep/ .modal__window {
  width: 60%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
}

h3 {
  margin: 0 0 .1em;
  font-size: 2em;
}
</style>
