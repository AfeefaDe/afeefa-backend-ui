<template>
  <div>
    <div v-for="annotation in entry.annotations" :key="annotation.id" class="annotation">
      <entry-icon :item="annotation" />
      <div class="editForm" v-if="annotationToEdit === annotation">
        <annotation-form
          :entry="entry" :annotationToEdit="annotationToEdit" :inline="true"
          @save="annotationSaved" @close="closeForm" />
      </div>
      <div v-else @click="openEditForm(annotation)" class="content">
        <div class="category">{{ annotation.annotationCategory.title }}</div>
        <div class="detail">{{ annotation.detail }}</div>
        <div class="status">
          {{ $t('status.changed') }}
          <span>{{annotation.updated_at | formatDateRelative}}</span>
          <span v-if="annotation.last_editor"> von {{ annotation.last_editor.name }} <span v-if="annotation.last_editor.organization">({{ annotation.last_editor.organization }})</span></span>
        </div>
      </div>
      <div class="links" v-if="annotationToEdit !== annotation">
        <a href="" @click.prevent="openEditForm(annotation)" class="inlineEditLink">Ändern</a>
        <a href="" @click.prevent="removeAnnotation(annotation)" class="inlineEditLink">Löschen</a>
      </div>
    </div>
  </div>
</template>

<script>
import AnnotationCategory from '@/models/AnnotationCategory'
import Annotation from '@/models/Annotation'
import AnnotationTag from '@/components/AnnotationTag'
import AnnotationForm from './AnnotationForm'

export default {
  props: ['entry'],

  data () {
    return {
      annotationCategories: [],
      selectedAnnotationCategory: null,
      annotationToEdit: null
    }
  },

  created () {
    AnnotationCategory.Query.getAll().then(annotationCategories => {
      this.annotationCategories = annotationCategories.filter(annotationCategory => !annotationCategory.generatedBySystem)
    })
  },

  methods: {
    openAddForm () {
      this.annotationToEdit = new Annotation()
      this.annotationToEdit.annotationCategory = this.selectedAnnotationCategory
      this.annotationToEdit.annotation_category_id = this.selectedAnnotationCategory.id
      this.selectedAnnotationCategory = null
    },

    openEditForm (annotation) {
      this.annotationToEdit = annotation
    },

    closeForm () {
      this.annotationToEdit = null
    },

    annotationSaved () {
      if (!this.annotationToEdit.id) {
        this.entry.$rels.annotations.refetch()
      }
      this.closeForm()
    },

    removeAnnotation (annotation) {
      this.$store.dispatch('messages/showDialog', {
        title: 'Aufgabe löschen',
        message: `Soll die Aufgabe ${annotation.annotationCategory.title} gelöscht werden?`
      }).then(result => {
        if (result === 'yes') {
          this.entry.$rels.annotations.Query.delete(annotation).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Die Aufgabe wurde gelöscht'
              })
              this.entry.$rels.annotations.refetch()
            }
          })
        }
      })
    }
  },

  components: {
    AnnotationTag,
    AnnotationForm
  }
}
</script>

<style lang="scss" scoped>
select {
  display: inline-block;
}

.annotation {
  padding: 1.5em 0 1.2em;
  position: relative;
  display: flex;
  align-items: center;
  &:not(:last-child) {
    border-bottom: 1px solid $gray20;
  }
  &:first-child {
    padding-top: 0;
  }

  .entryIcon {
    display: none;
    flex: 0 0 44px;
  }

  .content {
    width: 100%;
  }

  .editForm {
    width: 100%;
    margin-bottom: .5em;
    .annotationForm {
      max-width: 600px;
    }
  }

  .category {
    font-size: 1.4em;
    margin: 0;
    font-weight: 500;
    line-height: 120%;
    display: block;
  }

  .detail {
    margin-top: .5em;
    font-size: 1em;
    color: $gray90;
    white-space: pre-wrap;
  }

  .status {
    font-size: .9em;
    color: $gray50;
    margin-top: .4em;
  }

  .links {
    text-align: right;
    margin-left: 40px;
    margin-right: 2em;
    white-space: nowrap;

    a + a {
      margin-left: .5em;
    }
  }
}
</style>
