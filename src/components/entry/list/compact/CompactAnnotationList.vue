<template>
  <entry-detail-section title="Aufgaben"
    :clickLink="entry.annotations.length ? 'Hinzufügen' : ''" @click="editLinkClick"
    icon="assignment">
    <div class="annotationList">
      <create-button-box
        v-if="!entry.annotations.length && !newAnnotation"
        entryType="annotations"
        action="createEntry"
        @action="editLinkClick" />

      <annotation-form v-if="newAnnotation" class="addForm"
        :entry="entry" :annotationToEdit="newAnnotation"
        @close="cancel" @save="save" />

      <compact-entry-list :entries="entry.annotations" :pageSize="10" :hideIcon="true">
        <div slot="view" slot-scope="props" :class="['item', { first: !props.index }]">
          <annotation-tag :annotation="props.entry" :selected="contentVisible(props.entry)" @click="show(props.entry)" />

          <div class="content" v-if="contentVisible(props.entry) && annotationToEdit !== props.entry">
            <div class="status">
              {{ $t('status.changed') }}
              <span>{{ props.entry.updated_at | formatDateRelative(($i18n.locale)) }}</span>
              <span v-if="props.entry.last_editor"> von {{ props.entry.last_editor.name }}</span>
            </div>
            {{ props.entry.detail }}
            <div><a href="" @click.prevent="edit(props.entry)" class="inlineEditLink">Ändern</a></div>
          </div>

          <div v-if="annotationToEdit === props.entry">
            <annotation-form class="editForm" :entry="entry" :annotationToEdit="annotationToEdit"
              @close="cancel" @save="save" @remove="remove" />
          </div>
        </div>
      </compact-entry-list>

    </div>
  </entry-detail-section>
</template>

<script>
import Annotation from '@/models/Annotation'
import CompactEntryList from '@/components/entry/list/CompactEntryList'
import AnnotationForm from '@/components/annotation/AnnotationForm'

export default {
  props: ['entry'],

  data () {
    return {
      annotationToEdit: null,
      visibleContents: [],
      isEntryDetailSectionContent: true,
      newAnnotation: null
    }
  },

  computed: {
    editLinkTitle () {
      return this.entry.annotations.length && !this.newAnnotation ? 'Hinzufügen' : ''
    }
  },

  methods: {
    editLinkClick () {
      this.annotationToEdit = null
      this.newAnnotation = new Annotation()
    },

    show (annotation) {
      this.annotationToEdit = null
      this.newAnnotation = null

      if (!this.contentVisible(annotation)) {
        this.visibleContents.push(annotation)
      } else {
        const index = this.visibleContents.indexOf(annotation)
        this.visibleContents.splice(index, 1)
      }
    },

    edit (annotation) {
      this.annotationToEdit = annotation
      this.newAnnotation = null
    },

    contentVisible (annotation) {
      console.log(this.visibleContents)
      return this.visibleContents.includes(annotation)
    },

    cancel () {
      this.annotationToEdit = null
      this.newAnnotation = null
    },

    remove () {
      this.entry.$rels.annotations.refetch()
      this.cancel()
    },

    save () {
      this.entry.$rels.annotations.refetch()
      this.cancel()
    }
  },

  components: {
    CompactEntryList,
    AnnotationForm
  }
}
</script>

<style lang="scss" scoped>
.annotationList {
  width: 80%;

  /deep/ .entry {
    &:first-child {
      border: none;
    }
    border: none;
  }
}

.annotationForm.addForm {
  margin-bottom: .8em;
}

.annotationForm.editForm {
  margin-top: .8em;
  margin-bottom: .5em;
}

.annotationTag {
  cursor: pointer;
}

.item {
  width: 100%;
}

.view {
  cursor: pointer;
}

.status {
  color: $gray50;
  font-size: .9em;
  margin-bottom: .3em;
}

.content {
  margin-top: .8em;
}
</style>
