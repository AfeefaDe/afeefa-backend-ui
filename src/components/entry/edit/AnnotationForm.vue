<template>
  <div>
    <div class="annotationEditArea">
      <annotation-tag
        v-for="annotation in item.annotations"
        :annotation="annotation"
        :editMode="true"
        @remove="removeAnnotation"
        :key="annotation.id">
      </annotation-tag>
      <p v-if="!item.annotations.length" class="annotationArea__error">Keine Anmerkungen</p>
      <div class="annotationNew">
        <select class="browser-default annotationNew" v-model="selectedAnnotation" @change="addAnnotation">
          <option :value="null" selected>Neue Anmerkung hinzufügen</option>
          <option :value="annotation" v-for="annotation in selectableAnnotations" :key="annotation.id">{{ annotation.title }}</option>
        </select>
      </div>
    </div>
    <span class="validation-hint">
      <i class="material-icons">error_outline</i>
      Anmerkungen sind nicht öffentlich sichtbar und dienen nur den Redakteur*innen.
    </span>
  </div>
</template>

<script>
import AnnotationCategory from '@/models/AnnotationCategory'
import Annotation from '@/models/Annotation'

export default {
  props: ['item'],

  inject: ['$validator'],

  data () {
    return {
      annotationCategories: [],
      selectedAnnotation: null
    }
  },

  created () {
    AnnotationCategory.Query.getAll().then(annotationCategories => {
      this.annotationCategories = annotationCategories
    })
  },

  computed: {
    selectableAnnotations () {
      return this.annotationCategories.filter(annotationCategory => !annotationCategory.generatedBySystem)
    }
  },

  methods: {
    addAnnotation () {
      const annotationCategory = this.selectedAnnotation
      let newAnnotation = new Annotation()
      // the detail attribute is currently reserved for annoations generated by the backend
      newAnnotation.detail = null
      newAnnotation.annotationCategory = annotationCategory
      this.item.annotations.push(newAnnotation)
      this.selectedAnnotation = null
    },

    removeAnnotation (annotation) {
      const index = this.item.annotations.indexOf(annotation)
      if (index !== -1) {
        this.item.annotations.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .annotationEditArea {
    margin-top: 0.5em;
    &__error {
      color: $gray50;
      margin-left: 0.3em;
    }

    .annotationTag {
      display: block;
      margin-top: 1.5em;
    }

    .annotationNew {
      display: block;
      width: 100%;
      margin-top: 0.4em;
    }
  }
</style>
