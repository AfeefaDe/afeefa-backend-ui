<template>
  <div>
    <div v-for="annotation in entry.annotations" :key="annotation.id" class="listItem">
      <div class="annotation">
        <entry-icon :item="annotation" />
        <div class="editForm" v-if="annotationToEdit === annotation">
          <annotation-form
            :entry="entry" :annotationToEdit="annotationToEdit" :inline="true"
            @save="annotationSaved" @close="closeForm" />
        </div>
        <div v-else @click="openEditForm(annotation)" class="content">
          <div class="category">{{ annotation.annotationCategory.title }}</div>
          <div class="detail">{{ annotation.detail }}</div>
        </div>
        <div class="links" v-if="annotationToEdit !== annotation">
          <a href="" @click.prevent="openEditForm(annotation)" class="inlineEditLink">Ändern</a>
          <a href="" @click.prevent="removeAnnotation(annotation)" class="inlineEditLink">Erledigen</a>
        </div>
        <div v-else class="links">
          <a href="" @click.prevent="closeForm" class="inlineEditLink">Abbrechen</a>
        </div>
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
        title: 'Anmerkung löschen',
        message: `Soll die Anmerkung ${annotation.annotationCategory.title} gelöscht werden?`
      }).then(result => {
        if (result === 'yes') {
          this.entry.$rels.annotations.Query.delete(annotation).then(deleted => {
            if (deleted) {
              this.$store.dispatch('messages/showAlert', {
                description: 'Die Anmerkung wurde gelöscht'
              })
              this.annotationSaved()
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

.listItem {
  &:not(:last-child) {
    border-bottom: 1px solid $gray20;
  }
}

.annotation {
  padding: 1.5em 0 1.2em;
  position: relative;
  display: flex;
  align-items: center;

  .entryIcon {
    flex: 0 0 44px;
  }

  .content {
    width: 100%;
  }

  .editForm {
    width: 100%;
    margin-bottom: .5em;
    .annotationForm {
      max-width: 500px;
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

  .links {
    text-align: right;
    margin-left: 28px;
    margin-right: 2em;
  }
}
</style>
